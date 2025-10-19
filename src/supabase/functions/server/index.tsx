import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Storage bucket name
const BUCKET_NAME = 'make-c28f50fa-photos';

// Initialize storage bucket
async function initializeBucket() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 10485760 // 10MB
      });
      if (error) {
        console.log('Error creating bucket:', error);
      } else {
        console.log('Storage bucket created successfully');
      }
    }
  } catch (error) {
    console.log('Error initializing bucket:', error);
  }
}

// Initialize bucket on startup
initializeBucket();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Helper function to get user from access token
async function getUser(accessToken: string | undefined) {
  if (!accessToken) return null;
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error) {
    console.log('Authorization error while getting user:', error);
    return null;
  }
  return user;
}

// Health check endpoint
app.get("/make-server-c28f50fa/health", (c) => {
  return c.json({ status: "ok" });
});

// ============= IMAGE UPLOAD ENDPOINTS =============

// Upload image
app.post("/make-server-c28f50fa/upload-image", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const body = await c.req.json();
    const { file, fileName } = body;
    
    if (!file || !fileName) {
      return c.json({ error: 'File and fileName are required' }, 400);
    }
    
    // Convert base64 to buffer
    const base64Data = file.split(',')[1] || file;
    const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Generate unique file name
    const timestamp = Date.now();
    const uniqueFileName = `${timestamp}_${fileName}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(uniqueFileName, buffer, {
        contentType: 'image/*',
        upsert: false
      });
    
    if (error) {
      console.log('Error uploading file:', error);
      return c.json({ error: error.message }, 500);
    }
    
    // Get signed URL (valid for 1 year)
    const { data: urlData, error: urlError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(uniqueFileName, 31536000); // 1 year in seconds
    
    if (urlError) {
      console.log('Error creating signed URL:', urlError);
      return c.json({ error: urlError.message }, 500);
    }
    
    return c.json({ 
      success: true, 
      url: urlData.signedUrl,
      path: data.path 
    });
  } catch (error) {
    console.log('Error in upload-image endpoint:', error);
    return c.json({ error: 'Failed to upload image' }, 500);
  }
});

// ============= AUTH ENDPOINTS =============

// Check if admin exists
app.get("/make-server-c28f50fa/auth/check-admin", async (c) => {
  try {
    const admins = await kv.getByPrefix('admin:');
    const hasAdmin = admins && admins.length > 0;
    return c.json({ hasAdmin });
  } catch (error) {
    console.log('Error checking admin existence:', error);
    return c.json({ error: 'Failed to check admin' }, 500);
  }
});

// Initialize default admin account
app.post("/make-server-c28f50fa/auth/init-admin", async (c) => {
  try {
    const defaultEmail = 'admin@rccglivingwordforney.com';
    const defaultPassword = 'admin';
    
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      return c.json({ error: listError.message }, 500);
    }
    
    const adminExists = existingUsers?.users?.some(user => user.email === defaultEmail);
    
    if (adminExists) {
      const existingAdmin = existingUsers?.users?.find(user => user.email === defaultEmail);
      if (existingAdmin) {
        const { error: updateError } = await supabase.auth.admin.updateUserById(existingAdmin.id, {
          password: defaultPassword
        });
        
        if (updateError) {
          return c.json({ error: updateError.message }, 500);
        }
        
        await kv.set(`admin:${existingAdmin.id}`, {
          id: existingAdmin.id,
          email: existingAdmin.email,
          name: 'Super Admin',
          role: 'superadmin',
          createdAt: existingAdmin.created_at
        });
      }
      return c.json({ 
        success: true, 
        message: 'Default admin password updated',
        existed: true,
        email: defaultEmail
      });
    }
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: defaultEmail,
      password: defaultPassword,
      email_confirm: true,
      user_metadata: { name: 'Super Admin', role: 'superadmin' }
    });
    
    if (error) {
      return c.json({ error: error.message }, 400);
    }
    
    await kv.set(`admin:${data.user.id}`, {
      id: data.user.id,
      email: data.user.email,
      name: 'Super Admin',
      role: 'superadmin',
      createdAt: new Date().toISOString()
    });
    
    return c.json({ 
      success: true, 
      message: 'Default admin created',
      existed: false,
      email: defaultEmail,
      user: data.user
    });
  } catch (error) {
    return c.json({ error: 'Failed to initialize admin: ' + (error.message || error) }, 500);
  }
});

// Setup admin (create first admin user)
app.post("/make-server-c28f50fa/auth/setup-admin", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    // Check if admin already exists
    const admins = await kv.getByPrefix('admin:');
    if (admins && admins.length > 0) {
      return c.json({ error: 'Admin already exists' }, 400);
    }
    
    // Create user in Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm since email server isn't configured
      user_metadata: { name: name || email.split('@')[0], role: 'admin' }
    });
    
    if (error) {
      console.log('Error creating admin user in Supabase Auth:', error);
      return c.json({ error: error.message }, 400);
    }
    
    // Store admin info in KV store
    await kv.set(`admin:${data.user.id}`, {
      id: data.user.id,
      email: data.user.email,
      name: name || email.split('@')[0],
      role: 'admin',
      createdAt: new Date().toISOString()
    });
    
    return c.json({ 
      success: true, 
      user: {
        id: data.user.id,
        email: data.user.email,
        name: name || email.split('@')[0]
      }
    });
  } catch (error) {
    console.log('Error in setup-admin endpoint:', error);
    return c.json({ error: 'Failed to setup admin' }, 500);
  }
});

// Login
app.post("/make-server-c28f50fa/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.log('Error during login:', error);
      return c.json({ error: error.message }, 401);
    }
    
    // Get user details from KV store
    const userDetails = await kv.get(`admin:${data.user.id}`);
    
    return c.json({ 
      success: true,
      session: data.session,
      user: userDetails || {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || email.split('@')[0]
      }
    });
  } catch (error) {
    console.log('Error in login endpoint:', error);
    return c.json({ error: 'Failed to login' }, 500);
  }
});

// Get current session
app.get("/make-server-c28f50fa/auth/session", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ session: null, user: null });
    }
    
    const userDetails = await kv.get(`admin:${user.id}`);
    
    return c.json({ 
      session: { access_token: accessToken },
      user: userDetails || {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0]
      }
    });
  } catch (error) {
    console.log('Error getting session:', error);
    return c.json({ error: 'Failed to get session' }, 500);
  }
});

// Logout
app.post("/make-server-c28f50fa/auth/logout", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (accessToken) {
      await supabase.auth.admin.signOut(accessToken);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Error during logout:', error);
    return c.json({ error: 'Failed to logout' }, 500);
  }
});

// Request password reset
app.post("/make-server-c28f50fa/auth/forgot-password", async (c) => {
  try {
    const { email } = await c.req.json();
    
    // Note: In production, this would send an email. For prototyping, we'll generate a code.
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store reset code temporarily (expires in 10 minutes)
    await kv.set(`reset:${email}`, {
      code: resetCode,
      email,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString()
    });
    
    // In a real app, send email here
    console.log(`Password reset code for ${email}: ${resetCode}`);
    
    return c.json({ 
      success: true, 
      message: 'Password reset code sent',
      // For development only - remove in production
      code: resetCode 
    });
  } catch (error) {
    console.log('Error in forgot-password endpoint:', error);
    return c.json({ error: 'Failed to process password reset' }, 500);
  }
});

// Verify reset code
app.post("/make-server-c28f50fa/auth/verify-reset-code", async (c) => {
  try {
    const { email, code } = await c.req.json();
    
    const resetData = await kv.get(`reset:${email}`);
    
    if (!resetData) {
      return c.json({ error: 'Invalid or expired reset code' }, 400);
    }
    
    if (resetData.code !== code) {
      return c.json({ error: 'Invalid reset code' }, 400);
    }
    
    if (new Date(resetData.expiresAt) < new Date()) {
      await kv.del(`reset:${email}`);
      return c.json({ error: 'Reset code expired' }, 400);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Error verifying reset code:', error);
    return c.json({ error: 'Failed to verify code' }, 500);
  }
});

// Reset password
app.post("/make-server-c28f50fa/auth/reset-password", async (c) => {
  try {
    const { email, newPassword } = await c.req.json();
    
    // Verify reset code exists
    const resetData = await kv.get(`reset:${email}`);
    if (!resetData) {
      return c.json({ error: 'Invalid password reset session' }, 400);
    }
    
    // Find user by email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.log('Error listing users:', listError);
      return c.json({ error: 'Failed to find user' }, 500);
    }
    
    const user = users.users.find(u => u.email === email);
    
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    
    // Update password
    const { error } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );
    
    if (error) {
      console.log('Error updating password:', error);
      return c.json({ error: error.message }, 400);
    }
    
    // Delete reset code
    await kv.del(`reset:${email}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Error in reset-password endpoint:', error);
    return c.json({ error: 'Failed to reset password' }, 500);
  }
});

// Change password (authenticated user)
app.post("/make-server-c28f50fa/auth/change-password", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { currentPassword, newPassword } = await c.req.json();
    
    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword
    });
    
    if (signInError) {
      return c.json({ error: 'Current password is incorrect' }, 400);
    }
    
    // Update password
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword
    });
    
    if (error) {
      return c.json({ error: error.message }, 400);
    }
    
    return c.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to change password' }, 500);
  }
});

// ============= MEMBERS ENDPOINTS =============

// Get all members
app.get("/make-server-c28f50fa/members", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const members = await kv.getByPrefix('member:');
    return c.json({ members: members || [] });
  } catch (error) {
    console.log('Error fetching members:', error);
    return c.json({ error: 'Failed to fetch members' }, 500);
  }
});

// Add member
app.post("/make-server-c28f50fa/members", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const memberData = await c.req.json();
    const memberId = `member:${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const member = {
      id: memberId,
      ...memberData,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };
    
    await kv.set(memberId, member);
    
    return c.json({ success: true, member });
  } catch (error) {
    console.log('Error adding member:', error);
    return c.json({ error: 'Failed to add member' }, 500);
  }
});

// Update member
app.put("/make-server-c28f50fa/members/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const memberId = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(memberId);
    if (!existing) {
      return c.json({ error: 'Member not found' }, 404);
    }
    
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    };
    
    await kv.set(memberId, updated);
    
    return c.json({ success: true, member: updated });
  } catch (error) {
    console.log('Error updating member:', error);
    return c.json({ error: 'Failed to update member' }, 500);
  }
});

// Delete member
app.delete("/make-server-c28f50fa/members/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const memberId = c.req.param('id');
    await kv.del(memberId);
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting member:', error);
    return c.json({ error: 'Failed to delete member' }, 500);
  }
});

// ============= EVENTS ENDPOINTS =============

// Get all events
app.get("/make-server-c28f50fa/events", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const events = await kv.getByPrefix('event:');
    return c.json({ events: events || [] });
  } catch (error) {
    console.log('Error fetching events:', error);
    return c.json({ error: 'Failed to fetch events' }, 500);
  }
});

// Add event
app.post("/make-server-c28f50fa/events", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const eventData = await c.req.json();
    const eventId = `event:${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const event = {
      id: eventId,
      ...eventData,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };
    
    await kv.set(eventId, event);
    
    return c.json({ success: true, event });
  } catch (error) {
    console.log('Error adding event:', error);
    return c.json({ error: 'Failed to add event' }, 500);
  }
});

// Update event
app.put("/make-server-c28f50fa/events/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const eventId = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(eventId);
    if (!existing) {
      return c.json({ error: 'Event not found' }, 404);
    }
    
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    };
    
    await kv.set(eventId, updated);
    
    return c.json({ success: true, event: updated });
  } catch (error) {
    console.log('Error updating event:', error);
    return c.json({ error: 'Failed to update event' }, 500);
  }
});

// Delete event
app.delete("/make-server-c28f50fa/events/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const eventId = c.req.param('id');
    await kv.del(eventId);
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting event:', error);
    return c.json({ error: 'Failed to delete event' }, 500);
  }
});

// ============= DONATIONS ENDPOINTS =============

// Get all donations
app.get("/make-server-c28f50fa/donations", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const donations = await kv.getByPrefix('donation:');
    return c.json({ donations: donations || [] });
  } catch (error) {
    console.log('Error fetching donations:', error);
    return c.json({ error: 'Failed to fetch donations' }, 500);
  }
});

// Add donation
app.post("/make-server-c28f50fa/donations", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const donationData = await c.req.json();
    const donationId = `donation:${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const donation = {
      id: donationId,
      ...donationData,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };
    
    await kv.set(donationId, donation);
    
    return c.json({ success: true, donation });
  } catch (error) {
    console.log('Error adding donation:', error);
    return c.json({ error: 'Failed to add donation' }, 500);
  }
});

// ============= VOLUNTEERS ENDPOINTS =============

// Get all volunteers
app.get("/make-server-c28f50fa/volunteers", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const volunteers = await kv.getByPrefix('volunteer:');
    return c.json({ volunteers: volunteers || [] });
  } catch (error) {
    console.log('Error fetching volunteers:', error);
    return c.json({ error: 'Failed to fetch volunteers' }, 500);
  }
});

// Add volunteer
app.post("/make-server-c28f50fa/volunteers", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const volunteerData = await c.req.json();
    const volunteerId = `volunteer:${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const volunteer = {
      id: volunteerId,
      ...volunteerData,
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };
    
    await kv.set(volunteerId, volunteer);
    
    return c.json({ success: true, volunteer });
  } catch (error) {
    console.log('Error adding volunteer:', error);
    return c.json({ error: 'Failed to add volunteer' }, 500);
  }
});

// Update volunteer
app.put("/make-server-c28f50fa/volunteers/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const volunteerId = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(volunteerId);
    if (!existing) {
      return c.json({ error: 'Volunteer not found' }, 404);
    }
    
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    };
    
    await kv.set(volunteerId, updated);
    
    return c.json({ success: true, volunteer: updated });
  } catch (error) {
    console.log('Error updating volunteer:', error);
    return c.json({ error: 'Failed to update volunteer' }, 500);
  }
});

// Delete volunteer
app.delete("/make-server-c28f50fa/volunteers/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const volunteerId = c.req.param('id');
    await kv.del(volunteerId);
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting volunteer:', error);
    return c.json({ error: 'Failed to delete volunteer' }, 500);
  }
});

// ============= COMMUNICATIONS ENDPOINTS =============

// Get all communications
app.get("/make-server-c28f50fa/communications", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const communications = await kv.getByPrefix('communication:');
    return c.json({ communications: communications || [] });
  } catch (error) {
    console.log('Error fetching communications:', error);
    return c.json({ error: 'Failed to fetch communications' }, 500);
  }
});

// Add communication
app.post("/make-server-c28f50fa/communications", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const commData = await c.req.json();
    const commId = `communication:${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const communication = {
      id: commId,
      ...commData,
      date: new Date().toISOString().split('T')[0],
      status: commData.status || 'Draft',
      createdAt: new Date().toISOString(),
      createdBy: user.id
    };
    
    await kv.set(commId, communication);
    
    return c.json({ success: true, communication });
  } catch (error) {
    console.log('Error adding communication:', error);
    return c.json({ error: 'Failed to add communication' }, 500);
  }
});

// Update communication
app.put("/make-server-c28f50fa/communications/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const commId = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(commId);
    if (!existing) {
      return c.json({ error: 'Communication not found' }, 404);
    }
    
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    };
    
    await kv.set(commId, updated);
    
    return c.json({ success: true, communication: updated });
  } catch (error) {
    console.log('Error updating communication:', error);
    return c.json({ error: 'Failed to update communication' }, 500);
  }
});

// Delete communication
app.delete("/make-server-c28f50fa/communications/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const commId = c.req.param('id');
    await kv.del(commId);
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting communication:', error);
    return c.json({ error: 'Failed to delete communication' }, 500);
  }
});

// Send email announcement
app.post("/make-server-c28f50fa/communications/send-email", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const { title, content, type, recipients } = await c.req.json();
    
    if (!title || !content || !recipients || recipients.length === 0) {
      return c.json({ error: 'Title, content, and recipients are required' }, 400);
    }
    
    // ============================================================
    // EMAIL INTEGRATION GUIDE
    // ============================================================
    // 
    // To enable real email sending in production, integrate with an email service:
    //
    // RECOMMENDED: Resend (https://resend.com)
    // 1. Install: npm install resend
    // 2. Get API key from Resend dashboard
    // 3. Set environment variable: RESEND_API_KEY
    // 4. Import: import { Resend } from 'resend';
    // 5. Initialize: const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    // 6. Replace the code below with actual email sending
    //
    // Other options:
    // - SendGrid: https://sendgrid.com
    // - Mailgun: https://mailgun.com
    // - Amazon SES: https://aws.amazon.com/ses/
    //
    // Example with Resend:
    // const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    // await resend.emails.send({
    //   from: 'Church Admin <noreply@yourchurch.com>',
    //   to: recipients,
    //   subject: `[${type}] ${title}`,
    //   html: `
    //     <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
    //       <h1 style="color: #333;">${title}</h1>
    //       <p style="color: #666; line-height: 1.6;">${content}</p>
    //       <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
    //       <p style="color: #999; font-size: 12px;">
    //         This announcement was sent from RCCG Living Word Forney Church Admin
    //       </p>
    //     </div>
    //   `
    // });
    // ============================================================
    
    // For now, we'll simulate sending emails (logs to console)
    console.log(`📧 Sending announcement "${title}" to ${recipients.length} recipients:`);
    console.log(`📬 Recipients: ${recipients.join(', ')}`);
    console.log(`📝 Content: ${content}`);
    console.log(`🏷️  Type: ${type}`);
    
    // Simulate email sending
    const emailPromises = recipients.map(async (email: string) => {
      // In production, replace this with actual email service API call
      return { email, status: 'sent' };
    });
    
    const results = await Promise.all(emailPromises);
    
    return c.json({ 
      success: true, 
      message: `Emails sent to ${recipients.length} recipient(s)`,
      results 
    });
  } catch (error) {
    console.log('Error sending emails:', error);
    return c.json({ error: 'Failed to send emails' }, 500);
  }
});

// ============= BLOG API =============

// Get all blog posts
app.get("/make-server-c28f50fa/blog", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const posts = await kv.getByPrefix('blog:');
    console.log('Fetched blog posts:', posts);
    
    // Handle empty array or null
    const validPosts = posts || [];
    
    // Sort by createdAt descending (newest first) if posts exist
    const sortedPosts = validPosts.length > 0 
      ? validPosts.sort((a: any, b: any) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        })
      : [];
    
    return c.json({ posts: sortedPosts });
  } catch (error) {
    console.log('Error fetching blog posts:', error);
    return c.json({ error: 'Failed to fetch blog posts' }, 500);
  }
});

// Add blog post
app.post("/make-server-c28f50fa/blog", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const postData = await c.req.json();
    const postId = `blog:${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const post = {
      id: postId,
      ...postData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user.id
    };
    
    await kv.set(postId, post);
    
    return c.json({ success: true, post });
  } catch (error) {
    console.log('Error adding blog post:', error);
    return c.json({ error: 'Failed to add blog post' }, 500);
  }
});

// Update blog post
app.put("/make-server-c28f50fa/blog/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const postId = c.req.param('id');
    const updates = await c.req.json();
    
    const existing = await kv.get(postId);
    if (!existing) {
      return c.json({ error: 'Blog post not found' }, 404);
    }
    
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    };
    
    await kv.set(postId, updated);
    
    return c.json({ success: true, post: updated });
  } catch (error) {
    console.log('Error updating blog post:', error);
    return c.json({ error: 'Failed to update blog post' }, 500);
  }
});

// Delete blog post
app.delete("/make-server-c28f50fa/blog/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const postId = c.req.param('id');
    await kv.del(postId);
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting blog post:', error);
    return c.json({ error: 'Failed to delete blog post' }, 500);
  }
});

// ============= SETTINGS ENDPOINTS =============

// Get church settings
app.get("/make-server-c28f50fa/settings", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const settings = await kv.get('church:settings');
    
    // Return default settings if none exist
    if (!settings) {
      const defaultSettings = {
        churchName: 'RCCG Living Word Forney',
        pastorName: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        timezone: 'cst',
        dateFormat: 'mdy',
        emailNotifications: true,
        memberNotifications: true,
        donationNotifications: true,
        eventNotifications: true,
        autoBackup: true,
        memberPortal: true
      };
      
      return c.json({ settings: defaultSettings });
    }
    
    return c.json({ settings });
  } catch (error) {
    console.log('Error fetching settings:', error);
    return c.json({ error: 'Failed to fetch settings' }, 500);
  }
});

// Update church settings
app.put("/make-server-c28f50fa/settings", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    const updates = await c.req.json();
    
    const existing = await kv.get('church:settings') || {};
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: user.id
    };
    
    await kv.set('church:settings', updated);
    
    return c.json({ success: true, settings: updated });
  } catch (error) {
    console.log('Error updating settings:', error);
    return c.json({ error: 'Failed to update settings' }, 500);
  }
});

// ============= USER MANAGEMENT ENDPOINTS =============

// Get all users (admin only)
app.get("/make-server-c28f50fa/users", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    // Check if user is super admin
    if (user.email !== 'admin@rccglivingwordforney.com') {
      return c.json({ error: 'Forbidden: Super admin only' }, 403);
    }
    
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.log('Error listing users:', error);
      return c.json({ error: 'Failed to list users' }, 500);
    }
    
    // Map users to include role and other metadata
    const users = data.users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.user_metadata?.name || '',
      role: u.user_metadata?.role || 'member',
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at
    }));
    
    return c.json({ users });
  } catch (error) {
    console.log('Error fetching users:', error);
    return c.json({ error: 'Failed to fetch users' }, 500);
  }
});

// Create new user (admin only)
app.post("/make-server-c28f50fa/users", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    // Check if user is super admin
    if (user.email !== 'admin@rccglivingwordforney.com') {
      return c.json({ error: 'Forbidden: Super admin only' }, 403);
    }
    
    const { email, password, name, role } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }
    
    // Create new user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { 
        name: name || '', 
        role: role || 'member' 
      }
    });
    
    if (error) {
      console.log('Error creating user:', error);
      return c.json({ error: error.message }, 400);
    }
    
    return c.json({ 
      success: true, 
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || '',
        role: data.user.user_metadata?.role || 'member'
      }
    });
  } catch (error) {
    console.log('Error creating user:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// Update user (admin only)
app.put("/make-server-c28f50fa/users/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    // Check if user is super admin
    if (user.email !== 'admin@rccglivingwordforney.com') {
      return c.json({ error: 'Forbidden: Super admin only' }, 403);
    }
    
    const userId = c.req.param('id');
    const { name, role, password } = await c.req.json();
    
    const updateData: any = {
      user_metadata: {}
    };
    
    if (name !== undefined) {
      updateData.user_metadata.name = name;
    }
    
    if (role !== undefined) {
      updateData.user_metadata.role = role;
    }
    
    if (password) {
      updateData.password = password;
    }
    
    const { data, error } = await supabase.auth.admin.updateUserById(userId, updateData);
    
    if (error) {
      console.log('Error updating user:', error);
      return c.json({ error: error.message }, 400);
    }
    
    return c.json({ 
      success: true, 
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || '',
        role: data.user.user_metadata?.role || 'member'
      }
    });
  } catch (error) {
    console.log('Error updating user:', error);
    return c.json({ error: 'Failed to update user' }, 500);
  }
});

// Delete user (admin only)
app.delete("/make-server-c28f50fa/users/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    // Check if user is super admin
    if (user.email !== 'admin@rccglivingwordforney.com') {
      return c.json({ error: 'Forbidden: Super admin only' }, 403);
    }
    
    const userId = c.req.param('id');
    
    // Prevent deleting the super admin
    const { data: targetUser } = await supabase.auth.admin.getUserById(userId);
    if (targetUser.user?.email === 'admin@rccglivingwordforney.com') {
      return c.json({ error: 'Cannot delete super admin account' }, 403);
    }
    
    const { error } = await supabase.auth.admin.deleteUser(userId);
    
    if (error) {
      console.log('Error deleting user:', error);
      return c.json({ error: error.message }, 400);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.log('Error deleting user:', error);
    return c.json({ error: 'Failed to delete user' }, 500);
  }
});

// Get current user info
app.get("/make-server-c28f50fa/auth/me", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const user = await getUser(accessToken);
    
    if (!user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }
    
    return c.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || '',
        role: user.user_metadata?.role || 'member',
        isSuperAdmin: user.email === 'admin@rccglivingwordforney.com'
      }
    });
  } catch (error) {
    console.log('Error getting user info:', error);
    return c.json({ error: 'Failed to get user info' }, 500);
  }
});

Deno.serve(app.fetch);
