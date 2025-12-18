require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const authMiddleware = require("./middleware/auth.middleware");

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const port = 5000;
 
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


app.get("/dashboard", authMiddleware, (req, res) => {
  res.json({
    message: "Welcome to dashboard",
    user: req.user,
  });
});

const pool = require("./config/db");

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("DB connection error", err);
  } else {
    console.log("DB connected at:", res.rows[0].now);
  }
});

