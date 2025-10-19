# Default Admin Account Information

## Super Admin Credentials

The system has a default super admin account:

**Email:** `admin@rccglivingwordforney.com`  
**Password:** `admin`

## How to Login

1. Open the church management system
2. On the login page, enter:
   - Email: `admin@rccglivingwordforney.com`
   - Password: `admin`
3. Click **Login**

## Changing Your Password

**IMPORTANT:** You should change the default password after your first login!

1. After logging in, click **Settings** in the sidebar
2. At the top of the Settings page, find the **My Account** section
3. Fill in the password change form:
   - **Current Password:** admin
   - **New Password:** (your new secure password)
   - **Confirm New Password:** (retype your new password)
4. Click **Change Password**

✅ All users can change their own passwords using this same feature in Settings.

## Super Admin Capabilities

The super admin account (`admin@rccglivingwordforney.com`) has full access to:

- **Dashboard** - View all metrics and statistics
- **Members** - Manage church members
- **Events** - Create and manage church events
- **Donations** - Track financial contributions
- **Volunteers** - Coordinate volunteer activities
- **Communications** - Send announcements and emails
- **Blog** - Manage church blog posts
- **Settings** - Configure church information and system settings
- **User Management** - Create and manage other admin accounts (Settings → User Management section)

## Creating Additional Users

Only the super admin can create new user accounts:

1. Go to **Settings** in the sidebar
2. Scroll down to the **User Management** section
3. Click **Add New User**
4. Fill in the user details:
   - Email address
   - Password
   - Name (optional)
   - Role (Administrator, Staff Member, Volunteer, or Member)
5. Click **Create User**

The new user can then login with their email and password, and change their password in Settings.

## Security Best Practices

### For Production Deployment:

1. ✅ **Change the default password immediately** after deployment
2. ✅ **Use strong passwords** - At least 12 characters with mixed case, numbers, and symbols
3. ✅ **Don't share admin credentials** - Create separate accounts for each administrator
4. ✅ **Regularly review user accounts** - Remove accounts that are no longer needed
5. ✅ **Use unique passwords** - Don't reuse passwords from other systems

## Password Requirements

- Minimum length: 6 characters (but we recommend 12+ for security)
- No special requirements (but we recommend using mixed case, numbers, and symbols)
- Passwords are securely stored using Supabase Auth encryption

## Troubleshooting

### Forgot Your Password?

If you forget your password after changing it from the default:

1. On the login page, click **Forgot password**
2. Enter your email address
3. Check the browser console for the reset code (in development mode)
4. Enter the code on the verification page
5. Set a new password

### Can't Access User Management?

Only the super admin (`admin@rccglivingwordforney.com`) can access the User Management section in Settings. Regular users will only see:
- My Account (password change)
- Church Information
- System Settings

### Need to Reset Another User's Password?

As a super admin, you can reset any user's password:

1. Go to **Settings** → **User Management**
2. Find the user in the list
3. Click the edit icon (pencil)
4. Enter a new password in the "Password (leave blank to keep current)" field
5. Click **Update User**

## Related Documentation

- See `SETTINGS_AND_FIXES.md` for settings and user management features
- See `TROUBLESHOOTING.md` for common issues and solutions
