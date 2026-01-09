require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const initializeDatabase = require("./utils/initDatabase");
const errorHandler = require("./middleware/errorHandler");

initializeDatabase();

// Security: Helmet helps secure Express apps by setting HTTP headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable for API
  crossOriginEmbedderPolicy: false
}));

// Performance: Compress responses
app.use(compression());

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all API routes
app.use('/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // More strict for auth routes
  message: 'Too many login attempts, please try again later.'
}));

app.use(limiter);

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
app.use(express.json({ limit: '10mb' })); // Add limit for security
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', async (req, res) => {
  try {
    const pool = require('./config/db');
    await pool.query('SELECT 1');
    res.json({
      status: 'healthy',
      database: 'connected',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: process.env.NODE_ENV === 'production' ? 'Service unavailable' : error.message
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

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler (must be last)
app.use(errorHandler);

const port = process.env.PORT || 5000; 
app.listen(port, () => {
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
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
