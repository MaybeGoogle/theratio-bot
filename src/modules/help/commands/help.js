const Discord = require('discord.js'),
	utils = require('../../../utils');

const subcommands = {
	'counting': require('./subcommands/counting.js'),
	'currency': require('./subcommands/currency.js'),
	'store': require('./subcommands/store.js'),
	'tracker': require('./subcommands/tracker.js')
};

const getDescription = () => {
return `
These commands can be used to show details about the commands and features available with TheRatioBot.\n
**Counting**
\`.help counting\`.\n
**Currency**
\`.help currency\`.\n
**Tracker**
\`.help tracker\`.
`;
};

module.exports = (client, message, args) => {
	const { channel } = message;

	const subcommand = args.shift();

	if(subcommand && subcommands[subcommand]) {
		subcommands[subcommand](client, message, args);
		return;
	}

	if(subcommand) {
		channel.send(utils.generateErrorEmbed('Could not find that help topic. Please try again'));
		return;
	}

	const embed = {
		title: 'RatioBot Help Index',
		color: 3447003,
		description: getDescription()
	};

	channel.send({ embed });
};
