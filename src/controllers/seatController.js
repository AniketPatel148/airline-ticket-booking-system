const Seat = require("../models/seat");
const lock = require("../utils/lock");

exports.reserveSeat = async (req, res) => {
	try {
		await lock.acquire();
		const { seatNumber, passengerPhone, passengerName, passengerAge } =
			req.body;

		if (seatNumber < 1 || seatNumber > 300) {
			lock.release();
			return res.status(400).json({ error: "Invalid seat number" });
		}

		let seat = await Seat.findOne({ seatNumber });

		if (!seat) {
			seat = new Seat({ seatNumber });
		}

		if (seat.isReserved) {
			lock.release();
			return res.status(400).json({ error: "Seat already reserved" });
		}

		seat.passengerPhone = passengerPhone;
		seat.passengerName = passengerName;
		seat.passengerAge = passengerAge;
		seat.isReserved = true;

		await seat.save();
		lock.release();
		res.status(200).json({ success: "Seat reserved successfully" });
	} catch (error) {
		lock.release();
		res.status(500).json({ error: "Server error" });
	}
};

exports.resetSeats = async (req, res) => {
	if (!req.user.isAdmin) {
		return res.status(403).json({ error: "Only admin can reset seats" });
	}

	try {
		await Seat.updateMany(
			{},
			{
				$set: {
					passengerPhone: null,
					passengerName: null,
					passengerAge: null,
					isReserved: false,
				},
			}
		);
		res.status(200).json({ success: "All seats reset successfully" });
	} catch (error) {
		res.status(500).json({ error: "Server error" });
	}
};
