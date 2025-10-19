# Troubleshooting Guide

## 404 Errors Fixed ✅

### Issue
```
Error response: 404 Not Found
Error loading data: Error: Request failed with status 404: 404 Not Found
```

### Root Cause
The new API endpoints for Settings and User Management were added to `/supabase/functions/make-server-c28f50fa/index.tsx` but not to `/supabase/functions/server/index.tsx`. The system uses the `server` directory endpoints.

### Solution Applied
Added all new endpoints to both server files:

#### Endpoints Added to `/supabase/functions/server/index.tsx`:

1. **Settings Endpoints**
   - `GET /make-server-c28f50fa/settings` - Get church settings
   - `PUT /make-server-c28f50fa/settings` - Update church settings

2. **User Management Endpoints** (Super Admin Only)
   - `GET /make-server-c28f50fa/users` - List all users
   - `POST /make-server-c28f50fa/users` - Create new user
   - `PUT /make-server-c28f50fa/users/:id` - Update user
   - `DELETE /make-server-c28f50fa/users/:id` - Delete user

3. **User Info Endpoint**
   - `GET /make-server-c28f50fa/auth/me` - Get current user info

### Additional Improvements

1. **Better Error Handling**
   - Settings component now has fallback behavior if endpoints are unavailable
   - Individual try-catch blocks for each data loading operation
   - User-friendly error messages via toast notifications

2. **Default Settings**
   - If settings endpoint fails, defaults are used
   - Users can still use the Settings page even if backend is unavailable

3. **File Size Limit**
   - Updated both server files to support 10MB image uploads (was 5MB)

---

## Common Issues and Solutions

### Settings Page Shows "Using default settings"

**Symptom**: Toast notification says "Using default settings. Settings endpoint may not be available."

**Possible Causes**:
1. Server hasn't been redeployed with new endpoints
2. Authentication token expired
3. Network connectivity issues

**Solutions**:
1. Refresh the page and log in again
2. Check browser console for specific error messages
3. Verify you're connected to the internet
4. Wait a moment and try again (server may be restarting)

---

### "User management not available"

**Symptom**: Toast notification says "User management not available" even for super admin.

**Possible Causes**:
1. Not logged in as `admin@rccglivingwordforney.com`
2. Server endpoints not deployed
3. Authentication issue

**Solutions**:
1. Verify you're logged in with the super admin account
2. Log out and log back in
3. Check browser console for error details
4. Verify server endpoints are deployed

---

### "Forbidden: Super admin only" Error

**Symptom**: 403 error when trying to access user management.

**Cause**: User is logged in but not with the super admin account.

**Solution**: 
1. Log out
2. Log in with `admin@rccglivingwordforney.com`
3. Only this specific email has user management access

---

### Images Failing to Upload

**Symptom**: "Image must be less than 10MB" or upload fails.

**Possible Causes**:
1. Image is larger than 10MB
2. Not authenticated
3. Storage bucket issue

**Solutions**:
1. Resize/compress image to under 10MB
2. Log out and log back in
3. Check browser console for specific error
4. Try a different image file

---

### Settings Not Saving

**Symptom**: Click "Save" but changes don't persist after refresh.

**Possible Causes**:
1. Not authenticated
2. Server endpoint error
3. Network issue

**Solutions**:
1. Check for error toast notifications
2. Open browser console to see detailed errors
3. Log out and log back in
4. Try again in a few moments

---

## Server File Locations

The system has TWO server directories:

1. **Primary**: `/supabase/functions/server/index.tsx`
   - This is the active server file
   - All endpoints must be added here

2. **Secondary**: `/supabase/functions/make-server-c28f50fa/index.tsx`
   - Mirror of the primary server
   - Keep in sync with primary

**Important**: When adding new endpoints, update BOTH files!

---

## Verification Steps

After any server changes, verify:

1. **Settings Endpoints**
   ```
   ✓ GET /settings returns default or saved settings
   ✓ PUT /settings saves and returns updated settings
   ```

2. **User Management Endpoints** (as super admin)
   ```
   ✓ GET /users lists all users
   ✓ POST /users creates new user
   ✓ PUT /users/:id updates user
   ✓ DELETE /users/:id deletes user
   ✓ GET /auth/me returns current user with isSuperAdmin flag
   ```

3. **Authorization**
   ```
   ✓ All endpoints require authentication
   ✓ User management requires super admin
   ✓ Regular admins get 403 for user management
   ```

---

## Testing the Fixes

### Test Settings:
1. Navigate to Settings page
2. Update Church Name
3. Click "Save Church Information"
4. Refresh the page
5. Verify Church Name persists

### Test User Management (Super Admin):
1. Log in as `admin@rccglivingwordforney.com`
2. Navigate to Settings
3. Scroll to "User Management" section
4. Click "Add User"
5. Create a test user
6. Verify user appears in list
7. Edit user role
8. Delete test user

---

## Browser Console Commands

### Check Current User
```javascript
// In browser console
fetch('https://YOUR_PROJECT.supabase.co/functions/v1/make-server-c28f50fa/auth/me', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('churchAdmin_accessToken')
  }
}).then(r => r.json()).then(console.log);
```

### Check Settings
```javascript
// In browser console
fetch('https://YOUR_PROJECT.supabase.co/functions/v1/make-server-c28f50fa/settings', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('churchAdmin_accessToken')
  }
}).then(r => r.json()).then(console.log);
```

---

## If Issues Persist

1. **Check Network Tab**: Open browser DevTools → Network tab → Filter by "Fetch/XHR"
2. **Check Console**: Look for red error messages
3. **Clear Cache**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. **Clear Storage**: DevTools → Application → Storage → Clear site data
5. **Try Incognito**: Test in private/incognito browser window

---

## Contact Support

If you continue to experience issues:
1. Note the exact error message
2. Check browser console for errors
3. Note what action triggered the error
4. Check if you're logged in as super admin (if user management related)
5. Provide this information to technical support

---

**Last Updated**: October 17, 2025  
**Version**: 1.1
