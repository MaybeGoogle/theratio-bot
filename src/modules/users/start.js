const mongoose = require('mongoose');

module.exports = client => {
	const userSchema = new mongoose.Schema({
		userId: String,
		wallet: Number,
		numberOfCounts: Number,
		purchasedRoles: [{ name: String }]
	});

	const User = mongoose.model('User', userSchema);

	client.db.User = User;
};
