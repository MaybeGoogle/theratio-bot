const path = require('path'),
	utils = require('../../../utils');

const configPath = path.join(__dirname, '../../../../config.json');

module.exports = async (client, message, args) => {
	const { channel, member, guild } = message,
		config = utils.requireUncached(require, configPath);

	let donationAmount = args[0],
		recipientArg = args[1],
		recipient = message.mentions.members.first();

	if(channel.id !== config.countSpamChannelID) {
		return;
	}

	if(args.length !== 2) {
		channel.send(utils.generateErrorEmbed('.donate command requires two arguments: the amount of RatioBucks to donate and a user mention.'));
		return;
	}

	donationAmount = parseInt(donationAmount);

	if(!recipient) {
		channel.send(utils.generateErrorEmbed('Could not find that user'));
		return;
	}

	if(donationAmount <= 0) {
		channel.send(utils.generateErrorEmbed('You must donate a positive number of RatioBucks'));
		return;
	}

	if(!utils.isPositiveInteger(donationAmount)) {
		channel.send(utils.generateErrorEmbed('You must provide a valid number of RatioBucks'));
		return;
	}

	if(recipient.id == member.id) {
		channel.send(utils.generateErrorEmbed('You cannot send RatioBucks to yourself'));
		return;
	}
	
	const user = await client.db.User.findOne({ userId: member.id }).exec(),
		recipientUser = await client.db.User.findOne({ userId: recipient.id }).exec();

	if(!user) {
		channel.send(utils.generateErrorEmbed(`Could not find wallet information for ${member.displayName}`));
		return;
	}

	if(!recipientUser) {
		channel.send(utils.generateErrorEmbed(`Could not find wallet information for ${recipient.displayName}`));
		return;
	}

	if(user.wallet < donationAmount) {
		channel.send(utils.generateErrorEmbed('You do not have enough RatioBucks for that donation'));
		return;
	}

	user.wallet = user.wallet - donationAmount;
	recipientUser.wallet = recipientUser.wallet + donationAmount;

	await user.save();
	await recipientUser.save();

	await channel.send({
		embed: {
			color: 0x0099ff,
			description: `Successfully donated $${donationAmount} RatioBucks to ${recipient.displayName}`
		}
	});
};
