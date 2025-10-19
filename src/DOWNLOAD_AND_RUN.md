# Download and Run - Simple Steps

## 📥 Step 1: Download & Extract

1. Download the project ZIP file or clone from repository
2. Extract to your desired location
3. Open terminal/command prompt in the project folder

---

## 📦 Step 2: Install Dependencies

```bash
npm install
```

⏱️ **Wait 2-3 minutes** for installation to complete.

You should see: `added 1200+ packages`

---

## 🚀 Step 3: Start the Application

```bash
npm run dev
```

⏱️ **Wait 5-10 seconds** for the server to start.

You should see:
```
VITE v5.0.12  ready in 500 ms
➜  Local:   http://localhost:5173/
```

Your browser should open automatically. If not, open http://localhost:5173

---

## 🔐 Step 4: Login

On the login page, enter:

**Email:**
```
admin@rccglivingwordforney.com
```

**Password:**
```
admin
```

Click **Login**

---

## 🔒 Step 5: Change Password (IMPORTANT!)

⚠️ **You MUST do this immediately for security!**

1. After login, you'll see the Dashboard
2. Click **Settings** in the left sidebar
3. At the top, find **My Account** section
4. Fill in the form:
   - **Current Password:** `admin`
   - **New Password:** _(your secure password - use 12+ characters)_
   - **Confirm New Password:** _(type it again)_
5. Click **Change Password**
6. You should see: "Password updated successfully!"

✅ **Write down your new password somewhere safe!**

---

## ⚙️ Step 6: Configure Church Information

Still in **Settings**, scroll down:

1. Find **Church Information** section
2. Fill in:
   - Church Name (default is filled)
   - Pastor Name
   - Address
   - Phone Number
   - Email Address
   - Website (optional)
3. Click **Save Church Information**

✅ Your church information is now saved!

---

## 🎉 You're Done!

Your Church Management System is now ready to use.

### What You Can Do Now:

**👥 Members**
- Add church members
- Track contact information
- Manage member groups

**📅 Events**
- Create church events
- Upload event banners
- Track attendance

**💰 Donations**
- Record donations
- View donation history
- Track financial contributions

**🤝 Volunteers**
- Manage volunteer database
- Track skills and availability
- Assign volunteers to events

**📧 Communications**
- Create announcements
- Send email notifications
- Reach members

**📝 Blog**
- Publish blog posts
- Upload featured images
- Manage content

**⚙️ Settings**
- Change your password
- Update church info
- Create user accounts (if you're super admin)

---

## 👥 Create Additional Users (Optional)

If you want to give access to staff members:

1. Go to **Settings**
2. Scroll to **User Management** section (bottom)
3. Click **Add New User**
4. Fill in:
   - Email
   - Password
   - Name (optional)
   - Role (Administrator, Staff, Volunteer, or Member)
5. Click **Create User**
6. Share the credentials with the new user

The new user should change their password after first login.

---

## 🆘 Having Issues?

### Can't run `npm install`?

**Make sure Node.js is installed:**
```bash
node --version
```

Should show v18.0.0 or higher. If not, download from https://nodejs.org

### Can't run `npm run dev`?

**Make sure dependencies are installed:**
```bash
npm install
```

### Port 5173 is already in use?

**Use a different port:**
```bash
npm run dev -- --port 5174
```

### Login doesn't work?

**Check you're using the exact credentials:**
- Email: `admin@rccglivingwordforney.com` (all lowercase, no spaces)
- Password: `admin` (all lowercase)

**Still not working?**
- Press F12 to open browser console
- Check for error messages
- Look in the red text for clues

### Blank page or errors?

**Try a hard refresh:**
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**Check the `.env` file exists:**
```bash
# Mac/Linux
ls -la .env

# Windows
dir .env
```

It should show the file exists.

### Still stuck?

Check these documentation files:
- `TROUBLESHOOTING.md` - Common issues and solutions
- `SETUP_INSTRUCTIONS.md` - Detailed setup guide
- `README.md` - Full documentation

---

## 📱 Browser Requirements

Works on:
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

Use the latest version for best experience.

---

## 💻 System Requirements

**Minimum:**
- Node.js 18+
- 2 GB RAM
- 500 MB free disk space (for node_modules)
- Internet connection

**Recommended:**
- Node.js 20+
- 4 GB RAM
- 1 GB free disk space
- Fast internet connection

---

## 🎯 Quick Reference

### Default Admin Credentials
- Email: `admin@rccglivingwordforney.com`
- Password: `admin`

### Important Commands
```bash
npm install        # Install dependencies
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Important URLs
- Development: http://localhost:5173
- Preview: http://localhost:4173

### Important Ports
- Default dev: 5173
- Default preview: 4173

---

## ✅ Success Checklist

After completing the steps above, you should be able to:

- [ ] See the login page
- [ ] Login with default credentials
- [ ] See the dashboard
- [ ] Navigate to all sections (Members, Events, etc.)
- [ ] Change the admin password
- [ ] Save church information
- [ ] Add a test member
- [ ] Create a test event
- [ ] Logout and login with new password

If all boxes are checked, you're all set! 🎉

---

## 📚 Next Steps

### Learn the System
1. Read `QUICK_REFERENCE.md` for feature overview
2. Explore each section (Dashboard, Members, Events, etc.)
3. Try adding test data
4. Create user accounts for your team

### Customize
1. Update church information in Settings
2. Configure system preferences
3. Set up email notifications
4. Upload church logo (if implementing)

### Deploy (When Ready)
1. Read `DEPLOYMENT_NOTE.md`
2. Build: `npm run build`
3. Test: `npm run preview`
4. Deploy the `dist` folder

---

## 🎊 Congratulations!

You've successfully set up your Church Management System!

**Total Setup Time:** ~5 minutes

**What Works:**
- ✅ Authentication
- ✅ Member management
- ✅ Event management
- ✅ Donation tracking
- ✅ Volunteer coordination
- ✅ Communications
- ✅ Blog publishing
- ✅ User management

**Ready to Use:** Yes! ✅

Start by adding your first church member or creating an upcoming event.

---

**Need Help?**  
Check the documentation files or open an issue.

**Version:** 1.0.0  
**Last Updated:** October 17, 2025  
**Church:** RCCG Living Word Forney

---

🙏 *Built with care for church ministry* 🙏
