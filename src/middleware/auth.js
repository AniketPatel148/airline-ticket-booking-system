const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	const token = req.header("Authorization")?.replace("Bearer ", "");

	if (!token) {
		return res.status(401).json({ error: "Invalid User! No token provided" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({ error: "Invalid token!" });
	}
};