const express = require("express");
const app = express();

app.use(express.json());

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});


const pool = require("./config/db");

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("DB connection error", err);
  } else {
    console.log("DB connected at:", res.rows[0].now);
  }
});
