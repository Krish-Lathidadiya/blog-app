require('dotenv').config();
const express = require("express");
const cookieParser = require('cookie-parser')
const connectDB = require("./config/db");
const { errorMiddleware } = require("./middlewares/error.middleware");
const routes = require("./routes");

const app = express();
app.use(express.json());
app.use(cookieParser())

connectDB();

// Routes
app.use(routes);

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
