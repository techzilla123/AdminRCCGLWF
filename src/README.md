# Church Management System

A comprehensive church management system built for RCCG Living Word Forney with React, TypeScript, Tailwind CSS v4, and Supabase.

## Features

- 👥 **Member Management** - Track and manage church members
- 📅 **Events & Services** - Create and manage church events
- 💰 **Financial Tracking** - Record and monitor donations
- 🤝 **Volunteer Coordination** - Organize volunteer activities
- 📧 **Communications** - Send announcements and emails
- 📝 **Blog Management** - Publish and manage blog posts
- ⚙️ **Settings** - Configure church information and user accounts
- 🔐 **Secure Authentication** - Powered by Supabase Auth
- 👤 **User Management** - Create and manage admin accounts

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui, Radix UI
- **Backend:** Supabase (Auth, Database, Storage)
- **Icons:** Lucide React
- **Charts:** Recharts

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account and project

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd church-management-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

The `.env` file is already included with the Supabase project credentials. If you need to update it:

```bash
# The .env file contains:
VITE_SUPABASE_URL=https://lujbfuhvarmbylcccuub.supabase.co
VITE_SUPABASE_ANON_KEY=<your-key-is-already-set>
```

**Note:** The Supabase service role key is managed server-side and should be kept secret.

### 4. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:5173`

### 5. Login

Use the default admin credentials:

- **Email:** `admin@rccglivingwordforney.com`
- **Password:** `admin`

⚠️ **Important:** Change the default password immediately after first login!

## Project Structure

```
church-management-system/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── figma/          # Figma-imported components
│   └── ui/             # shadcn/ui components
├── supabase/           # Supabase server functions
│   └── functions/
├── styles/             # Global CSS and Tailwind config
├── utils/              # Utility functions and API
├── imports/            # Figma imports and SVG assets
├── App.tsx             # Main application component
├── main.tsx            # React entry point
└── index.html          # HTML entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## First Time Setup

### Step 1: Login as Admin
1. Open the application
2. Login with default credentials (see above)

### Step 2: Change Password
1. Navigate to **Settings** → **My Account**
2. Change the default password to something secure
3. Use a password with at least 12 characters

### Step 3: Configure Church Information
1. Go to **Settings** → **Church Information**
2. Fill in:
   - Church name
   - Pastor name
   - Address
   - Phone number
   - Email
   - Website
3. Click **Save Church Information**

### Step 4: Create Additional Users (Optional)
1. Go to **Settings** → **User Management** (Super Admin only)
2. Click **Add New User**
3. Fill in user details and assign role
4. Inform the new user of their credentials
5. They can change their password in Settings

## User Roles

- **Super Admin** - Full access, can manage users
- **Administrator** - Access to all features, cannot manage users
- **Staff Member** - Limited administrative functions
- **Volunteer** - Limited access for volunteer coordination
- **Member** - Basic view-only access

## Key Features Guide

### Dashboard
- Overview of church metrics
- Quick statistics (members, events, donations)
- Recent activity and charts

### Members
- Add, edit, and delete members
- Track contact information and groups
- Search and filter members

### Events
- Create church events and services
- Upload event banners
- Track attendance and details

### Donations
- Record financial contributions
- Track donation types and amounts
- View donation history

### Volunteers
- Manage volunteer database
- Track skills and availability
- Assign to events

### Communications
- Create announcements
- Send email notifications
- Manage communication history

### Blog
- Publish church blog posts
- Upload featured images
- Manage categories and tags

### Settings
- **My Account** - Change your password
- **Church Information** - Update church details
- **System Settings** - Configure preferences
- **User Management** - Create/manage users (Super Admin only)

## Configuration

### Tailwind CSS v4

This project uses Tailwind CSS v4 with custom design tokens in `/styles/globals.css`. The configuration includes:

- Custom color scheme
- Typography system
- Dark mode support (via class strategy)
- Component-specific tokens

### Supabase Setup

The project is pre-configured with Supabase. If you need to set up your own instance:

1. Create a Supabase project at https://supabase.com
2. Enable Authentication in your project
3. Update `.env` with your project credentials
4. Deploy the server functions in `/supabase/functions`

## Troubleshooting

### Styling Not Loading (Plain HTML)?

If the app shows unstyled HTML after `npm run dev`:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Restart dev server
npm run dev

# Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
```

See `STYLING_FIX.md` for detailed information.

### Can't Login?
- Verify email and password are correct
- Check browser console for errors
- Use "Forgot password" feature

### Changes Not Saving?
- Check for error messages (toast notifications)
- Verify all required fields are filled
- Check browser console for errors

### Images Not Uploading?
- File size limit: 5MB
- Supported formats: JPG, PNG, GIF
- Check internet connection

### User Management Not Visible?
- Only Super Admin can access this feature
- Login with `admin@rccglivingwordforney.com`

## Documentation

Additional documentation is available in the project:

- `ADMIN_PASSWORD_INFO.md` - Admin account details
- `QUICK_REFERENCE.md` - Quick reference guide
- `SETTINGS_AND_FIXES.md` - Settings features
- `TROUBLESHOOTING.md` - Common issues
- `EMAIL_INTEGRATION_GUIDE.md` - Email setup
- `EVENT_BANNER_GUIDE.md` - Event banner upload guide

## Security Notes

### For Production Deployment:

1. ✅ Change default admin password immediately
2. ✅ Use strong, unique passwords (12+ characters)
3. ✅ Don't share admin credentials
4. ✅ Create separate accounts for each administrator
5. ✅ Keep Supabase service role key secret
6. ✅ Enable Row Level Security (RLS) in Supabase
7. ✅ Regularly review and remove unused accounts

### Password Requirements:

- Minimum length: 6 characters (12+ recommended)
- All users can change their own passwords
- Super Admin can reset any user's password

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Support

For issues or questions:

1. Check the documentation files
2. Review the browser console for errors
3. Contact your system administrator

## License

Proprietary - RCCG Living Word Forney

## Version

**Version:** 1.0.0  
**Last Updated:** October 17, 2025  
**Church:** RCCG Living Word Forney

---

Built with ❤️ for RCCG Living Word Forney
