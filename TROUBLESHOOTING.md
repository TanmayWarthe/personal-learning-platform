# Troubleshooting Guide - Registration 500 Error

## Quick Diagnosis Steps

### 1. Check Health Endpoint
Visit: `https://personal-learning-platform.onrender.com/health`

This will show you:
- ✅ Database connection status
- ✅ JWT_SECRET configuration
- ✅ NODE_ENV setting

### 2. Common Causes of 500 Error

#### A. Missing JWT_SECRET
**Symptom**: Registration fails with 500 error
**Solution**: 
1. Go to Render Dashboard → Your Web Service → Environment
2. Verify `JWT_SECRET` is set to: `a10275996d7676b31ee2cd541aa882b196da96d005b17c85a26ed37020d2bb9f`
3. Click "Save Changes"
4. Wait for automatic redeploy

#### B. Database Connection Issues
**Symptom**: Can't connect to PostgreSQL
**Solution**:
1. Verify `DATABASE_URL` in Render environment matches your database URL
2. Ensure database instance is running (check Render Dashboard → Databases)
3. Check if database tables exist (they should auto-create on startup)

#### C. Database Schema Not Created
**Symptom**: Error inserting user record
**Solution**:
1. Check Render logs for "Database schema created successfully"
2. If tables don't exist, manually run schema:
   - Go to Render Dashboard → Your Database → Connect
   - Use PSQL connection and run the contents of `server/database/schema.sql`

### 3. Check Render Logs

1. Go to Render Dashboard → Your Web Service → Logs
2. Look for:
   - `❌ Error initializing database:` - Database setup issue
   - `Registration error:` - Shows the actual error
   - `JWT_SECRET is not defined` - Missing environment variable
   - Database connection errors

### 4. Verify All Environment Variables

Required variables on Render:
```
DATABASE_URL = postgresql://learning_platform_user:...
JWT_SECRET = a10275996d7676b31ee2cd541aa882b196da96d005b17c85a26ed37020d2bb9f
FRONTEND_URL = https://self-learning-hub.vercel.app
YOUTUBE_API_KEY = AIzaSyAj4Y-HQU-Cwn3zCUQlZJ64p1x9kHdaoWg
NODE_ENV = production
PORT = 5000
```

### 5. Test Registration After Fixes

After making changes:
1. Wait for Render to redeploy (auto-happens when env vars change)
2. Check `/health` endpoint first
3. Try registration again
4. If still failing, check logs for detailed error message

## Additional Debugging

### Enhanced Error Logging
The code now includes detailed error logging. When registration fails, check Render logs for:
- Error message
- Error code
- Database error details
- Stack trace

### Manual Database Check
Connect to your database and verify:
```sql
-- Check if users table exists
SELECT * FROM information_schema.tables WHERE table_name = 'users';

-- Check users table structure
\d users;

-- Test insert (replace with test data)
INSERT INTO users (name, email, password_hash) 
VALUES ('Test User', 'test@example.com', 'test_hash');
```

## Still Having Issues?

1. Share the exact error from Render logs (look for "Registration error:")
2. Verify all environment variables are set correctly
3. Check database instance status in Render Dashboard
4. Ensure you've saved and redeployed after making environment changes
