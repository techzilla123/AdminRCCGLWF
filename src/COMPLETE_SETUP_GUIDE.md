# ✅ COMPLETE SETUP GUIDE - GUARANTEED TO WORK

This guide contains **EVERYTHING** you need to run this app locally with full Tailwind CSS styling.

---

## 📋 STEP 1: Prerequisites

Make sure you have:
- **Node.js** version 18 or higher ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- A **Supabase account** ([Sign up free](https://supabase.com/))

To check your Node.js version:
```bash
node --version
```

---

## 📦 STEP 2: Install Dependencies

Open terminal in the project folder and run:

```bash
npm install
```

**Wait for it to complete.** This installs:
- React 18.2.0
- Tailwind CSS 3.4.1 (stable)
- PostCSS & Autoprefixer
- All UI components (Radix UI, etc.)
- Supabase client

---

## 🔑 STEP 3: Create Environment File

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```
   
   Or create a new file named `.env` in the root folder.

2. **Add your Supabase credentials:**

   Open `.env` and add:
   ```
   VITE_SUPABASE_URL=https://yourproject.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Where to find these values:**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project
   - Click "Settings" (⚙️ icon in sidebar)
   - Click "API"
   - Copy "Project URL" → paste as `VITE_SUPABASE_URL`
   - Copy "anon public" key → paste as `VITE_SUPABASE_ANON_KEY`

---

## 🚀 STEP 4: Start Development Server

Run:
```bash
npm run dev
```

You should see:
```
  VITE v5.0.12  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Open your browser to `http://localhost:5173`**

---

## ✅ STEP 5: Verify Styling is Working

You should see:

✅ **Login page with beautiful gradient background**  
✅ **Styled buttons with hover effects**  
✅ **Proper colors, shadows, and borders**  
✅ **Responsive layout**  
✅ **NOT plain HTML**  

### If you see plain HTML (no styling):

**DO THIS:**

1. **Stop the server** (press `Ctrl+C` in terminal)

2. **Clear Vite cache:**
   ```bash
   rm -rf node_modules/.vite
   ```

3. **Clear browser cache:**
   - Press `Ctrl+Shift+Delete` (Windows/Linux)
   - Or `Cmd+Shift+Delete` (Mac)
   - Select "Cached images and files"
   - Click "Clear data"

4. **Restart dev server:**
   ```bash
   npm run dev
   ```

5. **Hard refresh browser:**
   - Press `Ctrl+Shift+R` (Windows/Linux)
   - Or `Cmd+Shift+R` (Mac)

---

## 🎨 Configuration Files Explained

All these files have been created/updated for you:

### 1. `package.json`
- Contains all dependencies
- Uses **Tailwind CSS 3.4.1** (stable, not v4 alpha)
- Includes `tailwindcss-animate` plugin

### 2. `tailwind.config.js`
- Tailwind v3 configuration
- Defines theme colors and extensions
- Includes all content paths for scanning

### 3. `postcss.config.js`
- PostCSS configuration
- Processes Tailwind CSS
- Adds vendor prefixes with Autoprefixer

### 4. `vite.config.ts`
- Vite bundler configuration
- React plugin enabled
- Path aliases configured

### 5. `styles/globals.css`
- Imports Tailwind directives (`@tailwind base`, etc.)
- Defines CSS custom properties (color variables)
- Sets up dark mode support

### 6. `main.tsx`
- App entry point
- **Imports `./styles/globals.css`** (CRITICAL!)

### 7. `index.html`
- HTML template
- Loads `main.tsx`

---

## 🔍 Troubleshooting

### Problem: "Cannot find module 'tailwindcss'"

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### Problem: Styling still not showing

**Solution 1 - Check CSS is loaded:**
1. Open browser DevTools (F12)
2. Go to "Network" tab
3. Refresh page
4. Look for `globals.css` in the list
5. Click it - should show compiled Tailwind CSS

**Solution 2 - Verify Tailwind is processing:**
1. Open `styles/globals.css`
2. You should see `@tailwind base;` at the top
3. If not, the file was incorrectly modified

**Solution 3 - Nuclear option:**
```bash
# Delete everything
rm -rf node_modules package-lock.json .vite dist

# Reinstall
npm install

# Clear browser cache completely
# Then restart
npm run dev
```

---

### Problem: Build errors with TypeScript

**Solution:**
```bash
npm run build -- --mode development
```

Or temporarily, you can run without building:
```bash
npm run dev
```

---

### Problem: Port 5173 already in use

**Solution:**
The dev server will automatically try port 5174, 5175, etc.

Or kill the process on port 5173:
```bash
# On Mac/Linux:
lsof -ti:5173 | xargs kill -9

# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F
```

---

## 📁 Critical File Checklist

Make sure these files exist:

```
✅ package.json
✅ tailwind.config.js
✅ postcss.config.js
✅ vite.config.ts
✅ tsconfig.json
✅ tsconfig.node.json
✅ styles/globals.css
✅ main.tsx
✅ index.html
✅ App.tsx
✅ .env (you create this)
```

---

## 🧪 Test if Tailwind is Working

Add this to any component:

```tsx
<div className="bg-red-500 text-white p-4">
  If this is red with white text, Tailwind works!
</div>
```

If it's red → ✅ Tailwind is working!  
If it's plain → ❌ Something is wrong

---

## 📞 Quick Commands Reference

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Clear cache and restart
rm -rf node_modules/.vite && npm run dev
```

---

## 🎯 Login Information

### First Time Admin Setup:

1. Go to login page
2. Click "Forgot Password?"
3. Click "Create Admin Account"
4. Use email: `admin@rccglivingwordforney.com`
5. Set your password
6. Login

---

## ✅ Success Checklist

Before asking for help, verify:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Ran `npm install` successfully
- [ ] Created `.env` file with Supabase credentials
- [ ] Ran `npm run dev`
- [ ] Opened `http://localhost:5173` in browser
- [ ] Cleared browser cache
- [ ] Hard refreshed browser (Ctrl+Shift+R)
- [ ] Checked browser console for errors (F12)
- [ ] Verified `globals.css` loads in Network tab

---

## 🆘 Still Having Issues?

### Check Browser Console:
1. Press F12
2. Click "Console" tab
3. Look for red error messages
4. Common errors and fixes:

**Error: "Failed to fetch dynamically imported module"**
- Solution: Hard refresh (Ctrl+Shift+R)

**Error: "process is not defined"**
- Solution: Already handled in vite.config.ts

**Error: "Cannot find module"**
- Solution: `npm install`

### Check Terminal Output:
Look for errors when running `npm run dev`

**Error: "Cannot find module 'tailwindcss'"**
- Solution: Delete `node_modules` and run `npm install`

---

## 📚 Additional Documentation

- `README.md` - Project overview
- `ADMIN_SETUP_GUIDE.md` - Admin account details
- `EMAIL_INTEGRATION_GUIDE.md` - Email configuration
- `EVENT_BANNER_GUIDE.md` - How to upload images

---

## 🎉 You're All Set!

If you followed all steps and the styling works, you're ready to use the Church Management System!

**Need to stop the server?** Press `Ctrl+C` in the terminal.

**Need to restart?** Run `npm run dev` again.

---

**Last Updated:** October 19, 2025  
**Tailwind Version:** 3.4.1 (Stable)  
**Node Version Required:** 18+  
**Status:** ✅ Production Ready
