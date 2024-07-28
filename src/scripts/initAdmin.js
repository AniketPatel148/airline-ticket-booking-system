const mongoose = require("mongoose");
const User = require("../models/user");
require("dotenv").config();

const initAdminUser = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});

		const adminEmail = "admin@sukasaair.com";
		const existingAdmin = await User.findOne({ email: adminEmail });

		if (!existingAdmin) {
			const adminPassword =
				process.env.ADMIN_INITIAL_PASSWORD || "adminpassword123";
			const adminUser = new User({
				email: adminEmail,
				password: adminPassword,
				isAdmin: true,
			});

			await adminUser.save();
			console.log("Admin user created successfully");
		} else {
			console.log("Admin user already exists");
		}

		await mongoose.disconnect();
	} catch (error) {
		console.error("Error initializing admin user:", error);
	}
};

initAdminUser();
