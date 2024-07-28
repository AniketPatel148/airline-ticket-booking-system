const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const authController = require("../../src/controllers/authController");

jest.mock("../../src/models/user");
jest.mock("jsonwebtoken");

describe("Auth Controller", () => {
	let req, res;

	beforeEach(() => {
		req = {
			body: { email: "test@example.com" },
		};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
	});

	test("login should return token for valid user", async () => {
		User.findOne.mockResolvedValue({
			email: "test@example.com",
			isAdmin: false,
		});
		jwt.sign.mockReturnValue("fake_token");

		await authController.login(req, res);

		expect(res.json).toHaveBeenCalledWith({ token: "fake_token" });
	});

	test("login should return 401 for invalid user", async () => {
		User.findOne.mockResolvedValue(null);

		await authController.login(req, res);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
	});

	test("login should handle server errors", async () => {
		User.findOne.mockRejectedValue(new Error("Database error"));

		await authController.login(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
	});
});
