const Discord = require('discord.js');

const subcommands = {
	'help': require('./subcommands/help.js'),
	'list-roles': require('./subcommands/list-roles.js'),
	'buy-role': require('./subcommands/buy-role.js')
};

const getDescription = () => {
	return `
		The following items are available:

		**Role colours**
		List role colours available to purchase with the .store list-roles command.\n
	`;
};

module.exports = (client, message, args) => {
	const { channel } = message;

	const subcommand = args.shift();

	if(subcommand && subcommands[subcommand]) {
		subcommands[subcommand](client, message, args);
		return;
	}

	const embed = {
		title: 'TheRatioBot RatioBuck Store',
		color: 3447003,
		description: getDescription()
	};

	channel.send({ embed });
};
