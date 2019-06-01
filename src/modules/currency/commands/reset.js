const utils = require('../../../utils');

module.exports = async (client, message, args) => {
	const { channel, member, guild } = message,
		isAdmin = message.member.hasPermission('ADMINISTRATOR');

	if(!isAdmin) {
		return;
	}

	let username = args[0];

	if(!username) {
		channel.send(utils.generateErrorEmbed('Please provide a username'));
		return;
	}

	const recipient = await guild.members.find(user => user.displayName.toLowerCase() == username.toLowerCase());

	if(!recipient) {
		channel.send(`Could not find user ${username}`);
		return;
	}
	
	const recipientUser = await client.db.User.findOne({ userId: recipient.id }).exec();

	if(!recipientUser) {
		channel.send(utils.generateErrorEmbed(`Could not find wallet information for ${recipient.displayName}`));
		return;
	}

	recipientUser.wallet = 5;

	await recipientUser.save();

	await channel.send(`Successfully reset ${recipient.displayName}s wallet to 5`);
};
