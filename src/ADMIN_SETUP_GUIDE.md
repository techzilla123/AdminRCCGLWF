# Admin Setup Guide - RCCG Living Word Forney

## 🚀 Initial System Setup

### Step 1: First Time Setup

When you first access the system, you'll see the "Setup Admin" page.

**IMPORTANT - Use These Credentials:**
```
Email:    admin@rccglivingwordforney.com
Password: admin
```

⚠️ **Why These Specific Credentials Matter:**
- This email address is hardcoded as the "Super Admin"
- Only this account can manage other users
- Only this account can create new admin accounts
- Any other email will NOT have user management capabilities

### Step 2: Login

After setup, you'll be automatically logged in. For future logins:
1. Go to the login page
2. Use the same credentials:
   - Email: `admin@rccglivingwordforney.com`
   - Password: `admin`

### Step 3: Access Settings & User Management

1. Click on "Settings" in the left sidebar
2. As the super admin, you'll see all these sections:
   - ✅ Church Information
   - ✅ User Management (Super Admin Only)
   - ✅ Notification Settings
   - ✅ System Settings

---

## 👥 Managing Users

### Creating New Users

1. Navigate to **Settings** → **User Management**
2. Click **"Add User"** button
3. Fill in the form:
   - **Email**: User's email address
   - **Password**: Initial password (user should change later)
   - **Name**: Full name (optional but recommended)
   - **Role**: Select from:
     - `Administrator` - Full system access
     - `Staff Member` - Staff-level permissions
     - `Volunteer` - Volunteer-level permissions  
     - `Member` - Basic member permissions

4. Click **"Create User"**

### Making Someone an Admin

1. Find the user in the User Management list
2. Click the **Edit** button (pencil icon)
3. Change **Role** to `Administrator`
4. Optionally update their password
5. Click **"Save Changes"**

⚠️ **Important**: Even other "Administrator" users won't have the User Management section unless they are the super admin (`admin@rccglivingwordforney.com`)

### Viewing All Users

The User Management section shows:
- 👤 User's name and email
- 🛡️ Shield icon for super admin
- 📅 Account creation date
- 🔐 Last login date
- 🎭 Current role

### Editing Users

1. Click the **Edit** button next to any user
2. You can update:
   - Name
   - Role
   - Password (leave blank to keep current password)
3. Click **"Save Changes"**

### Deleting Users

1. Click the **Delete** button (trash icon) next to any user
2. Confirm the deletion in the popup
3. User will immediately lose access to the system

⚠️ **Protection**: You cannot delete the super admin account

---

## ⚙️ Managing Settings

### Church Information

Update your church details:
- Church Name (default: RCCG Living Word Forney)
- Pastor Name
- Physical Address
- Phone Number
- Email Address
- Website URL

Click **"Save Church Information"** to persist changes.

### Notification Settings

Toggle notifications for:
- Email Notifications (system events)
- New Member Notifications
- Donation Notifications
- Event Notifications

Click **"Save Notification Settings"** to persist changes.

### System Settings

Configure:
- **Timezone**: EST, CST, MST, PST
- **Date Format**: MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD
- **Automatic Backup**: Enable daily backups
- **Member Portal**: Allow member self-service access

Click **"Save System Settings"** to persist changes.

---

## 🔒 Security Best Practices

### For Super Admin Account

1. **Keep Credentials Secure**: The super admin account is powerful
2. **Don't Share**: Only trusted administrators should know these credentials
3. **Regular Review**: Periodically review the user list and remove inactive accounts
4. **Create Individual Accounts**: Don't share the super admin account - create individual admin accounts for each person

### For New Users

1. **Change Default Password**: Users should change their initial password after first login (future feature)
2. **Appropriate Roles**: Only give admin access to trusted personnel
3. **Regular Audits**: Review user access periodically

---

## 📋 User Roles Explained

### Administrator
- Full access to all features
- Can manage members, events, donations, volunteers
- Can view all reports and analytics
- Can manage communications and blog posts
- **Cannot** manage other users (unless super admin)

### Staff Member
- Access to most features
- Can manage day-to-day operations
- Can view reports
- Can manage communications

### Volunteer
- Limited access
- Can view schedules and assignments
- Can update their own information

### Member
- Basic access
- Can view their own information
- Can view public announcements

---

## 🆘 Troubleshooting

### "Cannot access User Management"
**Problem**: User doesn't see the User Management section in Settings.  
**Solution**: Only `admin@rccglivingwordforney.com` can access this. Make sure you're logged in with the super admin account.

### "Failed to save settings"
**Problem**: Settings don't save to database.  
**Solution**: 
1. Check your internet connection
2. Ensure you're still logged in (session may have expired)
3. Try refreshing the page and logging in again

### "Forbidden: Super admin only"
**Problem**: API returns 403 error when trying to manage users.  
**Solution**: This endpoint requires the super admin account. Regular admins cannot access user management.

### Lost Super Admin Password
**Problem**: Can't remember the super admin password.  
**Solution**: Contact your system administrator or technical support. Password resets for super admin require database access.

---

## 📞 Support

For technical support or questions about the system:
- Check the documentation in `/guidelines/Guidelines.md`
- Review API documentation in `/SETTINGS_AND_FIXES.md`
- Contact your system administrator

---

## ✅ Quick Setup Checklist

- [ ] Create super admin account with `admin@rccglivingwordforney.com`
- [ ] Login with super admin credentials
- [ ] Update Church Information in Settings
- [ ] Configure Notification Settings
- [ ] Set System Settings (timezone, date format)
- [ ] Create individual user accounts for each administrator
- [ ] Test login with a regular admin account
- [ ] Verify regular admins cannot access User Management
- [ ] Document credentials in a secure location

---

**System Version**: 1.0  
**Last Updated**: October 17, 2025  
**Church**: RCCG Living Word Forney
