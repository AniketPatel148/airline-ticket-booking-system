const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({
	seatNumber: { type: Number, required: true, unique: true },
	passengerPhone: String,
	passengerName: String,
	passengerAge: Number,
    isReserved: { type: Boolean, default: false },
});

module.exports = mongoose.model("Seat", seatSchema);
