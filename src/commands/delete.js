const Discord = require('discord.js');

module.exports = async (client, message, args) => {
	let error;
	const { channel } = message,
		isAdmin = message.member.hasPermission('ADMINISTRATOR');

	if(!isAdmin) return;

	if(!args || args.length == 0) {
		error = 'Not enough arguments';
	}

	if(!error && args.length > 1) {
		error = 'Too many arguments';
	}

	const count = args[0];

	if(!error && isNaN(Number(count))) {
		error = 'First argument must be an integer';
	}

	if(error) {
		const response = await channel.send(error);
		setTimeout(async () => await response.delete(), 2000);
		return;
	}

	await message.delete();
	await channel.bulkDelete(count);
};
