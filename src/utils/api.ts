import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-c28f50fa`;

// Store access token in memory
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
  if (token) {
    localStorage.setItem('churchAdmin_accessToken', token);
  } else {
    localStorage.removeItem('churchAdmin_accessToken');
  }
}

export function getAccessToken() {
  if (!accessToken) {
    accessToken = localStorage.getItem('churchAdmin_accessToken');
  }
  return accessToken;
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token || publicAnonKey}`,
    ...((options.headers as Record<string, string>) || {})
  };

  const url = `${API_BASE}${endpoint}`;
  console.log('Fetching:', url, 'with method:', options.method || 'GET');

  const response = await fetch(url, {
    ...options,
    headers
  });

  console.log('Response status:', response.status, 'for', endpoint);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response:', errorText);
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.error || `Request failed with status ${response.status}`);
    } catch (e) {
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }
  }

  return response.json();
}

// ============= AUTH API =============

export const authAPI = {
  async checkAdmin() {
    return fetchAPI('/auth/check-admin');
  },

  async initAdmin() {
    return fetchAPI('/auth/init-admin', {
      method: 'POST'
    });
  },

  async setupAdmin(email: string, password: string, name?: string) {
    const response = await fetchAPI('/auth/setup-admin', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    });
    return response;
  },

  async login(email: string, password: string) {
    const response = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (response.session?.access_token) {
      setAccessToken(response.session.access_token);
    }
    return response;
  },

  async getSession() {
    try {
      return await fetchAPI('/auth/session');
    } catch (error) {
      setAccessToken(null);
      throw error;
    }
  },

  async logout() {
    await fetchAPI('/auth/logout', { method: 'POST' });
    setAccessToken(null);
  },

  async forgotPassword(email: string) {
    return fetchAPI('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  async verifyResetCode(email: string, code: string) {
    return fetchAPI('/auth/verify-reset-code', {
      method: 'POST',
      body: JSON.stringify({ email, code })
    });
  },

  async resetPassword(email: string, newPassword: string) {
    return fetchAPI('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword })
    });
  },

  async changePassword(currentPassword: string, newPassword: string) {
    return fetchAPI('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }
};

// ============= MEMBERS API =============

export const membersAPI = {
  async getAll() {
    const response = await fetchAPI('/members');
    return response.members;
  },

  async add(memberData: any) {
    const response = await fetchAPI('/members', {
      method: 'POST',
      body: JSON.stringify(memberData)
    });
    return response.member;
  },

  async update(id: string, updates: any) {
    const response = await fetchAPI(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return response.member;
  },

  async delete(id: string) {
    return fetchAPI(`/members/${id}`, { method: 'DELETE' });
  }
};

// ============= EVENTS API =============

export const eventsAPI = {
  async getAll() {
    const response = await fetchAPI('/events');
    return response.events;
  },

  async add(eventData: any) {
    const response = await fetchAPI('/events', {
      method: 'POST',
      body: JSON.stringify(eventData)
    });
    return response.event;
  },

  async update(id: string, updates: any) {
    const response = await fetchAPI(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return response.event;
  },

  async delete(id: string) {
    return fetchAPI(`/events/${id}`, { method: 'DELETE' });
  }
};

// ============= DONATIONS API =============

export const donationsAPI = {
  async getAll() {
    const response = await fetchAPI('/donations');
    return response.donations;
  },

  async add(donationData: any) {
    const response = await fetchAPI('/donations', {
      method: 'POST',
      body: JSON.stringify(donationData)
    });
    return response.donation;
  },

  async delete(id: string) {
    return fetchAPI(`/donations/${id}`, { method: 'DELETE' });
  }
};

// ============= VOLUNTEERS API =============

export const volunteersAPI = {
  async getAll() {
    const response = await fetchAPI('/volunteers');
    return response.volunteers;
  },

  async add(volunteerData: any) {
    const response = await fetchAPI('/volunteers', {
      method: 'POST',
      body: JSON.stringify(volunteerData)
    });
    return response.volunteer;
  },

  async update(id: string, updates: any) {
    const response = await fetchAPI(`/volunteers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return response.volunteer;
  },

  async delete(id: string) {
    return fetchAPI(`/volunteers/${id}`, { method: 'DELETE' });
  }
};

// ============= COMMUNICATIONS API =============

export const communicationsAPI = {
  async getAll() {
    const response = await fetchAPI('/communications');
    return response.communications;
  },

  async add(commData: any) {
    const response = await fetchAPI('/communications', {
      method: 'POST',
      body: JSON.stringify(commData)
    });
    return response.communication;
  },

  async update(id: string, updates: any) {
    const response = await fetchAPI(`/communications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return response.communication;
  },

  async delete(id: string) {
    return fetchAPI(`/communications/${id}`, { method: 'DELETE' });
  },

  async sendEmail(announcementData: any) {
    const response = await fetchAPI('/communications/send-email', {
      method: 'POST',
      body: JSON.stringify(announcementData)
    });
    return response;
  }
};

// ============= IMAGE UPLOAD API =============

export const imageAPI = {
  async upload(file: string, fileName: string) {
    const response = await fetchAPI('/upload-image', {
      method: 'POST',
      body: JSON.stringify({ file, fileName })
    });
    return response;
  }
};

// ============= BLOG API =============

export const blogAPI = {
  async getAll() {
    const response = await fetchAPI('/blog');
    return response.posts;
  },

  async add(postData: any) {
    const response = await fetchAPI('/blog', {
      method: 'POST',
      body: JSON.stringify(postData)
    });
    return response.post;
  },

  async update(id: string, updates: any) {
    const response = await fetchAPI(`/blog/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return response.post;
  },

  async delete(id: string) {
    return fetchAPI(`/blog/${id}`, { method: 'DELETE' });
  }
};

// ============= SETTINGS API =============

export const settingsAPI = {
  async get() {
    const response = await fetchAPI('/settings');
    return response.settings;
  },

  async update(settings: any) {
    const response = await fetchAPI('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
    return response.settings;
  }
};

// ============= USER MANAGEMENT API =============

export const usersAPI = {
  async getAll() {
    const response = await fetchAPI('/users');
    return response.users;
  },

  async add(userData: any) {
    const response = await fetchAPI('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return response.user;
  },

  async update(id: string, updates: any) {
    const response = await fetchAPI(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return response.user;
  },

  async delete(id: string) {
    return fetchAPI(`/users/${id}`, { method: 'DELETE' });
  },

  async getCurrentUser() {
    const response = await fetchAPI('/auth/me');
    return response.user;
  }
};
