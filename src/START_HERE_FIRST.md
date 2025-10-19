# 🚀 START HERE FIRST

## Follow these 4 steps EXACTLY:

---

## ✅ STEP 1: Install

Open terminal in this folder and run:

```bash
npm install
```

Wait for it to finish (may take 2-3 minutes).

---

## ✅ STEP 2: Create .env file

Create a file named `.env` in this folder (same location as this file).

Add these two lines:

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

Replace with your actual Supabase credentials from https://supabase.com/dashboard

---

## ✅ STEP 3: Start the app

```bash
npm run dev
```

---

## ✅ STEP 4: Open browser

Go to: http://localhost:5173

---

## 🎨 You should see STYLED login page

✅ Beautiful colors and gradients  
✅ Styled buttons  
✅ Shadows and borders  
✅ NOT plain HTML  

---

## ❌ If you see PLAIN HTML (no styling):

1. **Stop the server** (Ctrl+C)

2. **Clear Vite cache:**
   ```bash
   rm -rf node_modules/.vite
   ```
   
   **Windows users:** Delete the `node_modules/.vite` folder manually

3. **Clear browser cache:**
   - Press `Ctrl+Shift+Delete`
   - Check "Cached images and files"
   - Click "Clear data"

4. **Restart:**
   ```bash
   npm run dev
   ```

5. **Hard refresh browser:**
   - Press `Ctrl+Shift+R` (Windows/Linux)
   - Press `Cmd+Shift+R` (Mac)

---

## 🆘 STILL NOT WORKING?

### Nuclear Option (Fixes 99% of issues):

```bash
# Delete everything
rm -rf node_modules package-lock.json node_modules/.vite

# Reinstall
npm install

# Start fresh
npm run dev
```

**Windows users:**
1. Delete `node_modules` folder
2. Delete `package-lock.json` file
3. Run `npm install`
4. Run `npm run dev`

---

## 📋 What was configured:

✅ `package.json` - Tailwind CSS 3.4.1 (stable)  
✅ `tailwind.config.js` - Complete Tailwind config  
✅ `postcss.config.js` - PostCSS + Autoprefixer  
✅ `vite.config.ts` - Vite bundler config  
✅ `styles/globals.css` - Tailwind imports + theme  
✅ `main.tsx` - Imports globals.css  
✅ `tsconfig.json` - TypeScript config  

**Everything is ready. Just run `npm install` and `npm run dev`!**

---

## 📞 Quick Reference:

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
```

---

## 🎯 First Login:

1. Go to login page
2. Click "Forgot Password?"
3. Click "Create Admin Account"  
4. Email: `admin@rccglivingwordforney.com`
5. Set your password

---

**Need detailed help?** Read `COMPLETE_SETUP_GUIDE.md`

**Status:** ✅ All configuration files complete and tested
