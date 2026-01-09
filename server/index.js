require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const initializeDatabase = require("./utils/initDatabase");

initializeDatabase();

const allowedOrigins = [
  "http://localhost:3000",
  "https://self-learning-hub.vercel.app",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`CORS blocked origin: ${origin}`);
        console.log(`Allowed origins:`, allowedOrigins);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(cookieParser());
app.use(express.json());

app.get('/health', async (req, res) => {
  try {
    const pool = require('./config/db');
    await pool.query('SELECT 1');
    res.json({
      status: 'ok',
      database: 'connected',
      jwt_secret: process.env.JWT_SECRET ? 'configured' : 'missing',
      node_env: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error.message
    });
  }
});

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const courseRoutes = require("./routes/course.routes");
app.use("/courses", courseRoutes);

const userRoutes = require("./routes/user.routes");
app.use("/users", userRoutes);


const dashboardRoutes = require("./routes/dashboard.routes");
app.use("/dashboard", dashboardRoutes);

const progressRoutes = require("./routes/progress.routes");
app.use("/progress", progressRoutes);

const videoRoutes = require("./routes/video.routes");
app.use("/videos", videoRoutes);

const port = process.env.PORT || 5000; 
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const authMiddleware = require("./middleware/auth.middleware");
app.get("/dashboard", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to dashboard",
    user: req.user,
  });
});


// database connection test
const pool = require("./config/db");
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("DB connection error", err);
  } else {
    console.log("DB connected at:", res.rows[0].now);
  }
});






// YouTube playlist fetch test
const fetchPlaylistVideos = require("./utils/youtube");

app.get("/test-playlist", async (req, res) => {
  const videos = await fetchPlaylistVideos("PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt&si=gtHCIrhoTr1zmH3N");
  res.json(videos);
});
