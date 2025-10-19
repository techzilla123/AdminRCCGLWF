# Quick Start Guide

Get up and running in 5 minutes!

## 🚀 Installation (2 minutes)

```bash
# 1. Navigate to project folder
cd church-management-system

# 2. Install dependencies
npm install

# 3. Start the server
npm run dev
```

The app will open at http://localhost:5173

## 🔐 First Login (1 minute)

**Default Admin Credentials:**
- Email: `admin@rccglivingwordforney.com`
- Password: `admin`

⚠️ **MUST CHANGE THIS PASSWORD IMMEDIATELY!**

## 🔒 Change Password (1 minute)

1. After login, click **Settings** (left sidebar)
2. Find **My Account** section at top
3. Fill in:
   - Current Password: `admin`
   - New Password: (your secure password)
   - Confirm New Password: (retype it)
4. Click **Change Password**

✅ Done! Your system is now secure.

## ⚙️ Configure Church (1 minute)

Still in **Settings**:

1. Scroll to **Church Information**
2. Fill in your church details
3. Click **Save Church Information**

## 🎯 You're Ready!

Now explore:
- **Dashboard** - Overview
- **Members** - Add members
- **Events** - Create events
- **Donations** - Track finances
- **Volunteers** - Manage volunteers
- **Communications** - Send announcements
- **Blog** - Publish posts
- **Settings** - Manage everything

## 👥 Add More Users (Optional)

**Settings → User Management → Add New User**

Create accounts for:
- Staff members
- Other administrators
- Volunteers (if they need access)

## 📚 Need More Help?

- `SETUP_INSTRUCTIONS.md` - Detailed setup
- `README.md` - Full documentation
- `QUICK_REFERENCE.md` - Feature guide
- `TROUBLESHOOTING.md` - Fix issues

## 🆘 Common Issues

**Port 5173 busy?**
```bash
npm run dev -- --port 5174
```

**Login fails?**
- Check email: `admin@rccglivingwordforney.com`
- Check password: `admin` (before changing)
- Check browser console (F12)

**Blank page?**
- Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
- Check `.env` file exists
- Check browser console (F12)

**"Cannot find module" error?**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

**That's it!** Your Church Management System is ready to use. 🎉

Start by adding your first member or creating an event!
