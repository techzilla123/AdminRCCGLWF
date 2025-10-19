# After Download Checklist

Follow these steps **in order** after downloading the project.

## ✅ Step-by-Step Setup

### 1. Verify Files Extracted
```bash
# Navigate to project folder
cd church-management-system

# Check if package.json exists
ls package.json
# or on Windows: dir package.json
```

✅ You should see the file listed

---

### 2. Install Dependencies

```bash
npm install
```

**Wait for completion.** This takes 2-5 minutes.

✅ Expected output:
```
added 1200+ packages in 2m
```

❌ If you see errors:
```bash
# Try clean install
rm -rf node_modules package-lock.json
npm install
```

---

### 3. Verify Installation

```bash
# Check if node_modules exists
ls -d node_modules
# or on Windows: dir node_modules
```

✅ Folder should exist with ~1200 packages

---

### 4. Check Critical Files

Verify these files exist:

```bash
# On Mac/Linux
ls package.json vite.config.ts tsconfig.json main.tsx App.tsx styles/globals.css

# On Windows
dir package.json vite.config.ts tsconfig.json main.tsx App.tsx
dir styles\globals.css
```

✅ All files should be listed

---

### 5. Start Development Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.0.12  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

✅ Server started successfully

❌ If port 5173 is busy:
```bash
npm run dev -- --port 5174
```

---

### 6. Open in Browser

If browser doesn't open automatically:
- Manually open: http://localhost:5173

---

### 7. Verify Styling Loads

**Check the login page:**

✅ **Should see:**
- Blue "Login" button
- Styled input fields (light gray background)
- Proper spacing and margins
- "Forgot password" link (underlined)
- Church icon in header
- Professional layout

❌ **Should NOT see:**
- Plain white background everywhere
- Times New Roman font
- Unstyled black text
- No button styling
- Broken layout

---

### 8. If Styling Doesn't Load

**This is the most common issue!**

#### Fix A: Hard Refresh
```bash
# In browser, press:
# Windows/Linux: Ctrl + Shift + R
# Mac: Cmd + Shift + R
```

#### Fix B: Clear Cache
```bash
# Stop the server (Ctrl+C)
# Clear Vite cache
rm -rf node_modules/.vite

# Restart
npm run dev
```

#### Fix C: Reinstall
```bash
# Complete clean install
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### Fix D: Check Files
```bash
# Verify vite.config.ts has the Tailwind plugin
cat vite.config.ts
# Should contain: import tailwindcss from '@tailwindcss/vite'

# Verify globals.css has the import
cat styles/globals.css
# Should start with: @import "tailwindcss";
```

See `STYLING_FIX.md` for more details.

---

### 9. Login Test

**Use these exact credentials:**
- Email: `admin@rccglivingwordforney.com`
- Password: `admin`

✅ Should login successfully and see Dashboard

❌ If login fails:
- Check credentials (copy-paste to be sure)
- Check browser console for errors (F12)
- Verify internet connection (Supabase needs it)

---

### 10. Navigate Through App

**Click each menu item:**
- Dashboard ✅
- Members ✅
- Events ✅
- Donations ✅
- Volunteers ✅
- Communications ✅
- Blog ✅
- Settings ✅

All pages should load with proper styling.

---

### 11. Change Admin Password

**CRITICAL for security!**

1. Click **Settings**
2. Find **My Account** section (top of page)
3. Fill in:
   - Current Password: `admin`
   - New Password: (your secure password - 12+ characters)
   - Confirm New Password: (retype)
4. Click **Change Password**

✅ Should see: "Password updated successfully!"

---

### 12. Verify Changed Password

1. Click **Logout** (bottom of sidebar)
2. Try old password (`admin`) - should fail ❌
3. Login with new password - should work ✅

---

## 🎉 Success Criteria

If all of these are true, you're done:

- [x] Server starts without errors
- [x] Login page has proper styling
- [x] Can login with default credentials
- [x] Dashboard loads with cards and sidebar
- [x] All menu items navigate correctly
- [x] Changed admin password successfully
- [x] Can logout and login with new password

**Status: READY TO USE!** ✅

---

## ❌ Common Issues

### Issue: "Cannot find module"

```bash
npm install
```

### Issue: "Port 5173 already in use"

```bash
npm run dev -- --port 5174
```

Or kill the process:
```bash
# Mac/Linux
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Issue: Blank white page

```bash
# Check browser console (F12)
# Look for red errors
# Common fixes:

# 1. Hard refresh
Ctrl+Shift+R (or Cmd+Shift+R)

# 2. Clear cache
rm -rf node_modules/.vite
npm run dev

# 3. Reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: Styling not loading

**See `STYLING_FIX.md` for complete guide**

Quick fix:
```bash
# Ensure you have latest package.json with @tailwindcss/vite
cat package.json | grep tailwindcss

# Should show:
# "@tailwindcss/vite": "^4.0.0-alpha.25",
# "tailwindcss": "^4.0.0-alpha.25",

# If not, update package.json and reinstall
npm install
```

### Issue: TypeScript errors

```bash
npm install -D typescript
```

### Issue: Login fails

- Verify Supabase is accessible (check https://status.supabase.com)
- Check `.env` file exists with correct values
- Check browser console for API errors
- Verify internet connection

---

## 📊 System Check

Run these commands to verify your environment:

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version (should be 9+)
npm --version

# Check if dependencies installed
ls node_modules/@vitejs/plugin-react
ls node_modules/react
ls node_modules/@tailwindcss/vite

# Check if all config files exist
ls package.json vite.config.ts tsconfig.json .env
```

All commands should succeed.

---

## 🆘 Still Having Issues?

1. **Read the docs:**
   - `STYLING_FIX.md` - Styling issues
   - `TROUBLESHOOTING.md` - General issues
   - `SETUP_INSTRUCTIONS.md` - Detailed setup

2. **Check browser console:**
   - Press F12
   - Look at Console tab
   - Check for red errors

3. **Verify files:**
   - All files extracted correctly
   - No corrupted downloads
   - Correct folder structure

4. **Clean slate:**
   ```bash
   # Nuclear option - start fresh
   rm -rf node_modules package-lock.json .vite dist
   npm install
   npm run dev
   ```

---

## ✅ Final Verification

Before considering setup complete:

- [ ] `npm install` completed successfully
- [ ] `npm run dev` starts without errors
- [ ] Browser opens to http://localhost:5173
- [ ] Login page displays with proper styling
- [ ] Login works with default credentials
- [ ] Dashboard shows with sidebar and cards
- [ ] All pages navigate correctly
- [ ] Admin password changed
- [ ] No errors in browser console
- [ ] No errors in terminal

**All checked?** You're ready to use the system! 🎉

---

**Version:** 1.0.1  
**Last Updated:** October 17, 2025  
**Critical Fix:** Tailwind CSS v4 configuration added
