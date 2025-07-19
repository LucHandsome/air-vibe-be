const express = require("express");
const userRoutes = require("./user.route");

const router = express.Router();

// Mount user management routes
router.use("/users", userRoutes);

module.exports = router;