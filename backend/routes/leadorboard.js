const express = require("express");

const leaderboardController = require("../controller/leaderboardController");

const authenticatemiddleware = require("../middleware/middleware");

const router = express.Router();
router.get("/leaderboardrd", leaderboardController.getleaderboard);
module.exports =router;