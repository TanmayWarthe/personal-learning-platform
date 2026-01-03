# ⚠️ IMPORTANT: Add Environment Variable to Vercel

## Quick Fix for Import Playlist Feature

Your code has been fixed and pushed. Now add this environment variable to Vercel:

### Steps:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: `self-learning-hub`
3. **Go to Settings** → **Environment Variables**
4. **Add new variable**:
   ```
   Key: NEXT_PUBLIC_API_URL
   Value: https://personal-learning-platform.onrender.com
   ```
5. **Select environments**: Production, Preview, Development (check all)
6. **Click "Save"**
7. **Redeploy**: Go to Deployments → Click the three dots on the latest deployment → "Redeploy"

## What Was Fixed

### Issue:
The import-playlist page was calling `/courses/import-playlist` on the frontend (Vercel) instead of the backend (Render).

### Solution:
- ✅ Changed `fetch()` to `apiFetch()` in [import-playlist/page.tsx](client/src/app/import-playlist/page.tsx)
- ✅ Created `.env.local` with API URL for local development
- ✅ Created `.env.production` with API URL for Vercel (backup)
- ✅ Added documentation in [ENV_SETUP.md](client/ENV_SETUP.md)

## After Adding Environment Variable

The import playlist feature will work correctly and POST requests will go to:
```
https://personal-learning-platform.onrender.com/courses/import-playlist
```

Instead of:
```
https://self-learning-hub.vercel.app/courses/import-playlist ❌
```

## Verify the Fix

After redeployment, test the import playlist feature:
1. Go to https://self-learning-hub.vercel.app/import-playlist
2. Enter a YouTube playlist URL
3. Fill in the course details
4. Click "Create Course"

It should now successfully create the course! 🎉
