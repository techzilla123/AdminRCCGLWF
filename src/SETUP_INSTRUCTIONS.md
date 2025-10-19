# Complete Setup Instructions

This guide will walk you through setting up the Church Management System from scratch.

## Prerequisites Checklist

Before starting, make sure you have:

- ✅ Node.js version 18 or higher installed
- ✅ npm (comes with Node.js) or yarn package manager
- ✅ A code editor (VS Code recommended)
- ✅ Git installed (optional, for version control)
- ✅ A modern web browser (Chrome, Firefox, Safari, or Edge)

### Check Node.js Installation

```bash
node --version
# Should show v18.0.0 or higher

npm --version
# Should show 9.0.0 or higher
```

If Node.js is not installed, download it from https://nodejs.org

## Step-by-Step Setup

### Step 1: Extract/Clone the Project

If you received a ZIP file:
```bash
# Extract the ZIP file
# Navigate to the extracted folder
cd church-management-system
```

If using Git:
```bash
git clone <repository-url>
cd church-management-system
```

### Step 2: Install Dependencies

This will install all required packages (~300MB):

```bash
npm install
```

This process may take 2-5 minutes depending on your internet connection.

**Expected output:**
```
added 1200+ packages in 2m
```

### Step 3: Verify Environment File

The `.env` file should already exist with the correct Supabase configuration. Verify it exists:

**On Windows:**
```bash
type .env
```

**On Mac/Linux:**
```bash
cat .env
```

**Expected content:**
```
VITE_SUPABASE_URL=https://lujbfuhvarmbylcccuub.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

If the file is missing, copy from `.env.example`:
```bash
cp .env.example .env
```

### Step 4: Start the Development Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.0.12  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

The application should automatically open in your default browser at `http://localhost:5173`

### Step 5: Login for the First Time

1. You should see the login page
2. Enter the default admin credentials:
   - **Email:** `admin@rccglivingwordforney.com`
   - **Password:** `admin`
3. Click **Login**

If login is successful, you'll see the Dashboard.

### Step 6: Change Default Password (CRITICAL!)

**This is a security requirement!**

1. Click **Settings** in the left sidebar
2. At the top, find the **My Account** section
3. Fill in the password change form:
   - **Current Password:** `admin`
   - **New Password:** (use a strong password with 12+ characters)
   - **Confirm New Password:** (retype your new password)
4. Click **Change Password**
5. You should see a success message

**Write down your new password securely!**

### Step 7: Configure Church Information

1. In **Settings**, scroll down to **Church Information**
2. Fill in the following fields:
   - **Church Name** (default: RCCG Living Word Forney)
   - **Pastor Name**
   - **Address**
   - **Phone Number**
   - **Email Address**
   - **Website**
3. Click **Save Church Information**

### Step 8: Explore the System

Navigate through each section:

1. **Dashboard** - View overview and statistics
2. **Members** - Add your first church member
3. **Events** - Create your first event
4. **Donations** - Record donation information
5. **Volunteers** - Manage volunteers
6. **Communications** - Send announcements
7. **Blog** - Publish blog posts

### Step 9: Create Additional Users (Optional)

If you want to create accounts for staff members:

1. Go to **Settings** → **User Management** (bottom of page)
2. Click **Add New User**
3. Fill in:
   - **Email** (must be unique)
   - **Password** (user can change it later)
   - **Name** (optional)
   - **Role** (Administrator, Staff Member, Volunteer, or Member)
4. Click **Create User**
5. Share the credentials with the new user securely

The new user should change their password on first login.

## Troubleshooting Setup Issues

### Issue: `npm install` fails

**Solution 1:** Clear npm cache
```bash
npm cache clean --force
npm install
```

**Solution 2:** Delete node_modules and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

**Solution 3:** Try using different registry
```bash
npm install --registry https://registry.npmjs.org/
```

### Issue: Port 5173 is already in use

**Solution:** Use a different port
```bash
npm run dev -- --port 5174
```

Or kill the process using port 5173:

**On Mac/Linux:**
```bash
lsof -ti:5173 | xargs kill -9
```

**On Windows:**
```bash
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Issue: "Cannot find module" errors

**Solution:** Reinstall dependencies
```bash
npm install
```

### Issue: Blank page or white screen

**Solutions:**
1. Check browser console for errors (F12)
2. Clear browser cache and hard reload (Ctrl+Shift+R or Cmd+Shift+R)
3. Try a different browser
4. Check if `.env` file exists and has correct values

### Issue: Login doesn't work

**Solutions:**
1. Verify email is exactly: `admin@rccglivingwordforney.com`
2. Verify password is exactly: `admin`
3. Check browser console for errors
4. Verify Supabase is running (check https://status.supabase.com)
5. Check internet connection

### Issue: TypeScript errors

**Solution:** Ensure TypeScript is installed
```bash
npm install -D typescript
```

### Issue: Tailwind styles not loading

**Solution:** Rebuild the project
```bash
npm run build
npm run dev
```

## Building for Production

When ready to deploy:

### 1. Build the project
```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### 2. Preview the production build
```bash
npm run preview
```

This serves the production build locally for testing.

### 3. Deploy

The `dist` folder contains all files needed for deployment. You can deploy to:

- **Vercel** (recommended)
- **Netlify**
- **AWS S3 + CloudFront**
- **Any static hosting service**

#### Deploy to Vercel (easiest):

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts

## Development Tips

### Hot Reload
The development server supports hot module replacement (HMR). Changes to your code will automatically update in the browser without a full page reload.

### Browser DevTools
- Press `F12` to open DevTools
- Use the Console tab to see errors and logs
- Use the Network tab to inspect API calls

### Code Editor Setup (VS Code)

Recommended extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features

### Recommended VS Code Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## File Structure Explained

```
├── components/              # React components
│   ├── auth/               # Login, signup, password reset
│   ├── ui/                 # Reusable UI components (shadcn)
│   ├── Dashboard.tsx       # Dashboard page
│   ├── Members.tsx         # Members management
│   ├── Events.tsx          # Events management
│   └── ...                 # Other feature components
├── supabase/               # Backend server functions
│   └── functions/          # Supabase edge functions
├── styles/                 # CSS files
│   └── globals.css         # Global styles and Tailwind config
├── utils/                  # Utility functions
│   ├── api.ts              # API client
│   └── supabase/           # Supabase configuration
├── App.tsx                 # Main app component (routing)
├── main.tsx                # React entry point
├── index.html              # HTML entry point
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies and scripts
└── .env                    # Environment variables
```

## Environment Variables

The project uses these environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-side) | Yes |
| `VITE_APP_NAME` | Application name | No |
| `VITE_CHURCH_NAME` | Church name | No |

All `VITE_*` variables are exposed to the client. Others are server-side only.

## Next Steps

After completing setup:

1. ✅ Add church members
2. ✅ Create upcoming events
3. ✅ Record donations
4. ✅ Add volunteers
5. ✅ Send your first announcement
6. ✅ Publish a blog post
7. ✅ Invite staff members (create accounts)
8. ✅ Customize church information
9. ✅ Configure system preferences

## Getting Help

If you encounter issues not covered here:

1. Check the `TROUBLESHOOTING.md` file
2. Review the `README.md` for general information
3. Check browser console for error messages
4. Verify all files are present and intact
5. Ensure Node.js and npm versions are correct

## Support

For technical support or questions:
- Check the documentation files in the project
- Contact your system administrator
- Review Supabase documentation: https://supabase.com/docs

---

**Setup Complete!** 🎉

You now have a fully functional Church Management System.

**Remember:**
- Keep your admin password secure
- Backup your data regularly
- Only grant admin access to trusted individuals
- Monitor user accounts and remove unused ones

**Version:** 1.0.0  
**Last Updated:** October 17, 2025
