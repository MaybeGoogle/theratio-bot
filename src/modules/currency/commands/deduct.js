const path = require('path'),
	utils = require('../../../utils');

const configPath = path.join(__dirname, '../../../../config.json');

module.exports = async (client, message, args) => {
	const { channel, member, guild } = message,
		config = utils.requireUncached(require, configPath),
		isAdmin = message.member.hasPermission('ADMINISTRATOR');

	let recipient,
		deductAmount = args[0],
		username = args[1],
		mentionedUser = message.mentions.members.first();

	if(!isAdmin) return;

	if(args.length !== 2) {
		channel.send(utils.generateErrorEmbed('.deduct command requires two arguments: a username and the amount of RatioBucks to deduct.'));
		return;
	}

	deductAmount = parseInt(deductAmount);

	if(deductAmount <= 0) {
		channel.send(utils.generateErrorEmbed('You must deduct a positive number of RatioBucks'));
		return;
	}

	if(!utils.isPositiveInteger(deductAmount)) {
		channel.send(utils.generateErrorEmbed('You must provide a valid number of RatioBucks'));
		return;
	}

	if(mentionedUser) {
		recipient = mentionedUser;
	} else {
		recipient = await guild.members.find(user => user.displayName.toLowerCase() == username.toLowerCase()); 
	}

	if(!recipient) {
		channel.send(utils.generateErrorEmbed(`Could not find user ${username}`));
		return;
	}

	if(recipient.id == member.id) {
		channel.send(utils.generateErrorEmbed('You cannot send RatioBucks to yourself'));
		return;
	}
	
	const recipientUser = await client.db.User.findOne({ userId: recipient.id }).exec();

	if(!recipientUser) {
		channel.send(utils.generateErrorEmbed(`Could not find wallet information for ${recipient.displayName}`));
		return;
	}

	if((recipientUser.wallet - deductAmount) < 0) {
		deductAmount = recipientUser.wallet;
	}

	recipientUser.wallet = recipientUser.wallet - deductAmount;

	await recipientUser.save();

	await channel.send({
		embed: {
			color: 0x0099ff,
			description: `deducted $${deductAmount} RatioBucks to ${recipient.displayName}`
		}
	});
};
