# Client Environment Variables

## Required Environment Variables

### NEXT_PUBLIC_API_URL
The backend API URL for making requests.

**Local Development:**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**Production (Vercel):**
```
NEXT_PUBLIC_API_URL=https://personal-learning-platform.onrender.com
```

## Setup Instructions

### For Local Development
1. Create a `.env.local` file in the `client/` directory
2. Add: `NEXT_PUBLIC_API_URL=http://localhost:5000`

### For Vercel Deployment
The `.env.production` file is included and will be used automatically.

Alternatively, you can set environment variables in Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add `NEXT_PUBLIC_API_URL` with value `https://personal-learning-platform.onrender.com`
