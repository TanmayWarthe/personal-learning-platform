
# 🎓 Personal Learning Hub

> **A modern, self-paced learning platform that transforms YouTube playlists into structured courses with progress tracking and streak management.**

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://self-learning-hub.vercel.app)
[![Backend](https://img.shields.io/badge/backend-render-blue)](https://personal-learning-platform.onrender.com)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 🎯 The Problem

Self-learners face several challenges when using YouTube for education:

- **No Structure** - Playlists lack organization, modules, and clear learning paths
- **Zero Progress Tracking** - No way to track which videos you've completed
- **No Motivation** - Missing gamification elements like streaks and achievements
- **Poor Discovery** - Hard to manage multiple learning resources in one place
- **No Accountability** - Easy to lose momentum without tracking progress

## 💡 The Solution

**Personal Learning Hub** transforms scattered YouTube content into a structured, trackable learning experience:

✅ **Import YouTube Playlists** - Convert any public playlist into a structured course  
✅ **Track Progress** - Mark videos as complete and see your advancement  
✅ **Learning Streaks** - Build consistency with daily learning streak tracking  
✅ **Personalized Dashboard** - View all your courses and progress in one place  
✅ **Smart Organization** - Courses organized into modules with sequential unlocking  
✅ **User Profiles** - Manage your learning journey with detailed statistics  

---

## 🚀 Key Features

### For Learners
- 📚 **Import YouTube Playlists** - Paste any playlist URL and create a course instantly
- ✅ **Progress Tracking** - Visual indicators for completed videos and course progress
- 🔥 **Learning Streaks** - Daily streak counter to maintain momentum
- 📊 **Personal Dashboard** - Overview of all courses, progress, and statistics
- 🎯 **Sequential Learning** - Videos unlock as you complete previous ones
- 👤 **Profile Management** - View learning stats, streaks, and achievements
- 🗑️ **Course Management** - Delete courses you no longer need

### Technical Features
- 🔐 **Secure Authentication** - JWT-based auth with HTTP-only cookies
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- ⚡ **Fast Performance** - Optimized React components with memoization
- 🎨 **Modern UI/UX** - Clean, professional interface with Tailwind CSS
- 🔄 **Real-time Updates** - Instant progress updates across all pages
- 🌐 **RESTful API** - Well-structured backend with proper error handling

---

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **HTTP Client:** Fetch API
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT + HTTP-only Cookies
- **Password Hashing:** bcrypt
- **API Integration:** YouTube Data API v3
- **Deployment:** Render

### DevOps
- **Version Control:** Git/GitHub
- **CI/CD:** Automatic deployment on push
- **Database Hosting:** Render PostgreSQL
- **Environment Management:** dotenv

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **YouTube Data API Key** - [Get one here](https://console.cloud.google.com/apis/credentials)
- **Git** - [Download](https://git-scm.com/downloads)

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/TanmayWarthe/personal-learning-platform.git
cd personal-learning-platform
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file in `server/` directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/learning_platform

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# API Keys
YOUTUBE_API_KEY=your-youtube-api-key-here

# Server
PORT=5000
NODE_ENV=development

# Frontend (for CORS)
FRONTEND_URL=http://localhost:3000
```

Initialize the database:

```bash
# Database tables will be created automatically on first run
npm run dev
```

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create `.env.local` file in `client/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Run the Application

**Start Backend** (Terminal 1):
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Start Frontend** (Terminal 2):
```bash
cd client
npm run dev
# App runs on http://localhost:3000
```

### 5. Access the Application

Open your browser and navigate to:
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **Health Check:** [http://localhost:5000/health](http://localhost:5000/health)

---

## 🎮 How to Use

### Getting Started (New Users)

1. **Visit the Landing Page** → `http://localhost:3000` or [Live Demo](https://self-learning-hub.vercel.app)
2. **Click "Sign Up"** → Create your account with name, email, and password
3. **Login** → Use your credentials to access the platform

### Importing Your First Course

1. **Navigate to "Add Playlist"** in the sidebar
2. **Find a YouTube Playlist** you want to learn from (must be public)
3. **Copy the Playlist URL** (e.g., `https://www.youtube.com/playlist?list=PLx...`)
4. **Paste the URL** and add course title & description
5. **Click "Create Course"** → Your course is ready!

### Learning & Tracking Progress

1. **Go to "Courses"** → View all your imported courses
2. **Click on a Course** → See the course details and video list
3. **Start Watching** → Click on a video to begin learning
4. **Mark as Complete** → Click the checkmark when you finish
5. **Track Your Progress** → See completion percentage on dashboard

### Managing Your Learning

- **Dashboard** - Overview of all courses and progress
- **Profile** - View your learning stats and streaks
- **Delete Courses** - Remove courses using the delete button (top-right on course cards)
- **Learning Streak** - Maintain daily learning to build your streak

---

## 🌐 Deployment

### Frontend (Vercel)

1. Fork/Push repository to GitHub
2. Visit [Vercel](https://vercel.com) and create new project
3. Import your repository
4. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
   ```
5. Deploy → Automatic deployments on every push

### Backend (Render)

1. Create PostgreSQL database on [Render](https://render.com)
2. Create new Web Service
3. Connect your repository
4. Add environment variables:
   ```
   DATABASE_URL=<your-postgres-connection-string>
   JWT_SECRET=<generate-random-secret>
   YOUTUBE_API_KEY=<your-youtube-api-key>
   FRONTEND_URL=https://your-frontend-url.vercel.app
   NODE_ENV=production
   ```
5. Deploy → Backend will auto-deploy on push

---

## 📁 Project Structure

```
personal-learning-platform/
├── client/                 # Frontend (Next.js)
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context providers
│   │   └── lib/           # Utility functions
│   ├── package.json
│   └── ...
│
├── server/                # Backend (Express)
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Auth & validation
│   ├── routes/           # API routes
│   ├── utils/            # Helper functions
│   ├── database/         # SQL schemas
│   ├── index.js          # Server entry point
│   └── package.json
│
├── render.yaml           # Render deployment config
├── README.md            # Documentation
└── LICENSE              # MIT License
```

---

## 🔒 Security Features

- ✅ **Password Hashing** - bcrypt with salt rounds
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **HTTP-only Cookies** - Protection against XSS
- ✅ **CORS Configuration** - Restricted origins
- ✅ **SQL Injection Protection** - Parameterized queries
- ✅ **Environment Variables** - Sensitive data protection

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 API Documentation

### Authentication Endpoints

- `POST /auth/register` - Create new user account
- `POST /auth/login` - Login and receive JWT token
- `POST /auth/logout` - Logout and clear session

### Course Endpoints

- `GET /courses` - Get all courses with progress
- `GET /courses/:id` - Get course details
- `POST /courses/import-playlist` - Import YouTube playlist
- `DELETE /courses/:id` - Delete a course
- `GET /courses/:id/content` - Get course content with modules
- `GET /courses/:id/videos` - Get all videos in course

### User Endpoints

- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update user profile

### Dashboard & Progress

- `GET /dashboard/summary` - Get learning statistics
- `GET /progress/streak` - Get learning streak data
- `POST /progress/:videoId/complete` - Mark video as complete

---

## 🐛 Troubleshooting

### Common Issues

**Issue:** "Cannot connect to database"
- **Solution:** Check `DATABASE_URL` in `.env` and ensure PostgreSQL is running

**Issue:** "YouTube API quota exceeded"
- **Solution:** YouTube API has daily limits. Wait 24 hours or use a different API key

**Issue:** "Login not working"
- **Solution:** Ensure `JWT_SECRET` is set and frontend/backend URLs are correct

**Issue:** "CORS errors"
- **Solution:** Check `FRONTEND_URL` matches your frontend URL exactly

---

## 📊 Database Schema

The platform uses PostgreSQL with the following main tables:

- **users** - User accounts and credentials
- **courses** - Imported courses from playlists
- **modules** - Course organization (for future features)
- **videos** - Individual videos within courses
- **user_video_progress** - Track user completion status
- **user_learning_streak** - Daily learning streak data

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Tanmay Warthe**

- GitHub: [@TanmayWarthe](https://github.com/TanmayWarthe)
- Live Demo: [https://self-learning-hub.vercel.app](https://self-learning-hub.vercel.app)

---

## 🙏 Acknowledgments

- YouTube Data API for video integration
- Next.js team for the amazing framework
- Vercel & Render for hosting
- Open source community

---

## 🗺️ Roadmap

- [ ] Admin panel for course management
- [ ] Comments & discussions on videos
- [ ] Notes taking feature
- [ ] Course recommendations
- [ ] Social sharing
- [ ] Mobile app (React Native)
- [ ] Certificate generation
- [ ] Quiz & assessments

---

**⭐ If you found this project helpful, please give it a star!**


