const express = require("express");
const router = express.Router();
const seatController = require("../controllers/seatController");
const auth = require("../middleware/auth");

router.post("/reserve", auth, seatController.reserveSeat);
router.post("/reset", auth, seatController.resetSeats);

module.exports = router;
