const express = require("express");
const authRoutes = require("./auth.route");

const router = express.Router();

// Mount authentication routes
router.use("/auth", authRoutes);

module.exports = router;