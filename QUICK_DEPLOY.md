# 🚀 Quick Deployment Checklist

## Pre-Deployment Setup ✅

Your code has been updated with:
- ✅ Backend CORS now uses `FRONTEND_URL` environment variable
- ✅ Frontend uses `NEXT_PUBLIC_API_URL` environment variable
- ✅ All API calls now use the centralized API utility
- ✅ Server port uses `PORT` environment variable

---

## 🎯 Recommended: Vercel + Railway (Easiest)

### Step 1: Deploy Backend to Railway

1. **Sign up:** [railway.app](https://railway.app)
2. **Create Project:** New Project → Deploy from GitHub → Select your repo
3. **Add PostgreSQL:** New → Database → PostgreSQL
4. **Configure Service:**
   - Root Directory: `server`
   - Start Command: `npm start`
5. **Add Environment Variables:**
   ```
   DB_HOST=<from Railway PostgreSQL>
   DB_PORT=5432
   DB_USER=<from Railway PostgreSQL>
   DB_PASSWORD=<from Railway PostgreSQL>
   DB_NAME=<from Railway PostgreSQL>
   JWT_SECRET=<generate random string>
   YOUTUBE_API_KEY=<your YouTube API key>
   NODE_ENV=production
   FRONTEND_URL=<will add after frontend deploy>
   PORT=5000
   ```
6. **Deploy** → Copy your backend URL (e.g., `https://your-app.railway.app`)

### Step 2: Deploy Frontend to Vercel

1. **Sign up:** [vercel.com](https://vercel.com)
2. **Import Project:** Add New Project → Import from GitHub
3. **Configure:**
   - Framework: Next.js
   - Root Directory: `client`
4. **Add Environment Variable:**
   ```
   NEXT_PUBLIC_API_URL=<your-railway-backend-url>
   ```
5. **Deploy** → Copy your frontend URL (e.g., `https://your-app.vercel.app`)

### Step 3: Update Backend CORS

1. Go back to Railway backend settings
2. Update `FRONTEND_URL` to your Vercel URL
3. Redeploy backend

### Step 4: Database Setup

1. Connect to your Railway PostgreSQL database
2. Run your database schema/migrations (if you have SQL files)

---

## 🔑 Environment Variables Reference

### Backend (`server/.env`)
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=learning_platform
JWT_SECRET=your-secret-key
YOUTUBE_API_KEY=your-youtube-key
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
PORT=5000
```

### Frontend (`client/.env`)
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

---

## 🧪 Testing After Deployment

1. ✅ Visit your frontend URL
2. ✅ Try registering a new account
3. ✅ Try logging in
4. ✅ Check if courses load
5. ✅ Verify API calls work (check browser console)

---

## 🆘 Common Issues

**CORS Errors:**
- Make sure `FRONTEND_URL` in backend matches your frontend domain exactly
- Check that it includes `https://` protocol

**API Connection Errors:**
- Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Check backend is running and accessible
- Test backend URL directly in browser

**Database Connection:**
- Verify all database credentials are correct
- Check database is accessible from Railway
- Review Railway logs for connection errors

---

## 📚 Full Documentation

See `DEPLOYMENT.md` for detailed instructions including:
- VPS deployment
- Docker deployment
- Advanced configurations

---

**Need Help?** Check the logs in Railway/Vercel dashboards for error messages.

