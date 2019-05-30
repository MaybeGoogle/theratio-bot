const mongoose = require('mongoose');

module.exports = client => {
	const userSchema = new mongoose.Schema({
		userId: String,
		wallet: Number,
		numberOfCounts: Number
	});

	const User = mongoose.model('User', userSchema);

	client.User = User;
};
