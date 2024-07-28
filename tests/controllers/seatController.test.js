const Seat = require("../../src/models/seat");
const seatController = require("../../src/controllers/seatController");
const lock = require("../../src/utils/lock");

jest.mock("../../src/models/seat");
jest.mock("../../src/utils/lock");

describe("Seat Controller", () => {
	let req, res;

	beforeEach(() => {
		req = {
			body: {
				seatNumber: 1,
				passengerPhone: "1234567890",
				passengerName: "John Doe",
				passengerAge: 30,
			},
			user: { isAdmin: false },
		};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		lock.acquire.mockResolvedValue();
		lock.release.mockReturnValue();
	});

	describe("reserveSeat", () => {
		test("should reserve an available seat", async () => {
			Seat.findOne.mockResolvedValue({
				seatNumber: 1,
				isReserved: false,
				save: jest.fn(),
			});

			await seatController.reserveSeat(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				success: "Seat reserved successfully",
			});
		});

		test("should return 400 for invalid seat number", async () => {
			req.body.seatNumber = 301;

			await seatController.reserveSeat(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: "Invalid seat number" });
		});

		test("should return 400 for already reserved seat", async () => {
			Seat.findOne.mockResolvedValue({
				seatNumber: 1,
				isReserved: true,
			});

			await seatController.reserveSeat(req, res);

			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith({ error: "Seat already reserved" });
		});
	});

	describe("resetSeats", () => {
		test("should reset all seats for admin user", async () => {
			req.user.isAdmin = true;
			Seat.updateMany.mockResolvedValue({});

			await seatController.resetSeats(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({
				success: "All seats reset successfully",
			});
		});

		test("should return 403 for non-admin user", async () => {
			await seatController.resetSeats(req, res);

			expect(res.status).toHaveBeenCalledWith(403);
			expect(res.json).toHaveBeenCalledWith({
				error: "Only admin can reset seats",
			});
		});
	});
});
