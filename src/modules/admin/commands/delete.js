const Discord = require('discord.js'),
	utils = require('../../../utils');

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
		try {
			const response = await channel.send(utils.generateErrorEmbed(error));
			setTimeout(async () => await response.delete(), 2000);
		} catch(error) {
			console.log(error);
		}
		return;
	}

	try {
		await message.delete();
		await channel.bulkDelete(count);
	} catch(error) {
		console.log(error);
	}
};
