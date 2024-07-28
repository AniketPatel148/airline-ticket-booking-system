require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const seatRoutes = require("./routes/seatRoutes");

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/seat", seatRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
