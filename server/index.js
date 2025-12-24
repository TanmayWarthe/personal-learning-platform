require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// middleware setup 
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());


// routes setup 

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



// start server
const port = process.env.PORT || 5000; 
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



// protected route example
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
