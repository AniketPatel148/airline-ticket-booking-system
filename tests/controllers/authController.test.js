const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../../src/models/user");
const authController = require("../../src/controllers/authController");

jest.mock("../../src/models/user");
jest.mock("jsonwebtoken");
jest.mock("bcryptjs");

describe("Auth Controller", () => {
	let req, res;

	beforeEach(() => {
		req = {
			body: { email: "test@example.com", password: "password123" },
		};
		res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
	});

	test("login should return token for valid user", async () => {
		const mockUser = {
			email: "test@example.com",
			password: "hashedPassword",
			isAdmin: false,
		};
		User.findOne.mockResolvedValue(mockUser);
		bcrypt.compare.mockResolvedValue(true);
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

	test("login should return 401 for invalid password", async () => {
		const mockUser = { email: "test@example.com", password: "hashedPassword" };
		User.findOne.mockResolvedValue(mockUser);
		bcrypt.compare.mockResolvedValue(false);

		await authController.login(req, res);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
	});

	test("login should handle server errors", async () => {
		User.findOne.mockRejectedValue(new Error("Database error"));

		await authController.login(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ error: "Server error!" });
	});

	test("register should create a new user and return a token", async () => {
		const mockUser = {
			email: "test@example.com",
			password: "hashedPassword",
			isAdmin: false,
			save: jest.fn().mockResolvedValue(true),
		};
		User.findOne.mockResolvedValue(null);
		User.mockImplementation(() => mockUser);
		jwt.sign.mockReturnValue("fake_token");

		req.body = { email: "test@example.com", password: "password123" };
		await authController.register(req, res);

		expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
		expect(mockUser.save).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith({ token: "fake_token" });
	});

	test("register should return 400 if email is already in use", async () => {
		User.findOne.mockResolvedValue({ email: "test@example.com" });

		req.body = { email: "test@example.com", password: "password123" };
		await authController.register(req, res);

		expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({ error: "Email already in use!" });
	});

	test("register should handle server errors", async () => {
		User.findOne.mockRejectedValue(new Error("Database error"));

		req.body = { email: "test@example.com", password: "password123" };
		await authController.register(req, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
	});
});
