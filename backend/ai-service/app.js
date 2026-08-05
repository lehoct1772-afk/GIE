const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({
        project: "Geometric Intelligence Engine",
        status: "Online",
        version: "0.1.0"
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("=================================");
    console.log(" GIE AI Server Started");
    console.log(" http://localhost:" + PORT);
    console.log("=================================");
});
