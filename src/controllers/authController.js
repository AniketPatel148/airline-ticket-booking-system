const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.register = async (req, res) => {
	try {
		const { email, password } = req.body;
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res.status(400).json({ error: "Email already in use!" });
		}

		const isAdmin = email === "admin@sukasaair.com";
		const user = new User({ email, password, isAdmin });
		await user.save();

		const token = jwt.sign(
			{ email: user.email, isAdmin: user.isAdmin },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);

		res.status(201).json({ token });
	} catch (error) {
		res.status(500).json({ error: "Server error" });
	}
};

exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (!user || !(await bcrypt.compare(password, user.password))) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		const token = jwt.sign(
			{ email: user.email, isAdmin: user.isAdmin },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);
		res.json({ token });
	} catch (error) {
		res.status(500).json({ error: "Server error!" });
	}
};
