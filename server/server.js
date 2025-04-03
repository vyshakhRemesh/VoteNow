const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/vote", require("./routes/voteRoutes"));
app.use("/api/candidates", require("./routes/candidateRoutes"));
app.use("/api/result", require("./routes/resultRoutes"));

// Connect to DB and start server
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
