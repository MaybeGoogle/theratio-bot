const path = require('path'),
	utils = require('../../../utils');

const configPath = path.join(__dirname, '../../../../config.json');

module.exports = async (client, message, args) => {
	const { channel, member } = message,
		config = utils.requireUncached(require, configPath);
		clientUser = client.user;

	if(channel.id !== config.countSpamChannelID) {
		return;
	}

	const username = args[0];

	if(username) {

	} else {
		let user = await client.db.User.findOne({ userId: member.id }).exec();

		if(!user) {
			user = new client.db.User({
				userId: member.id,
				wallet: 0,
				numberOfCounts: 0
			});

			await user.save();
		}

		const embed = {
			color: 0x0099ff,
			description: `${member.displayName} has $${user.wallet} RatioBucks`
		};

		channel.send({ embed });
	}
};
