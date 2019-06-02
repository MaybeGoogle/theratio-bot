const Discord = require('discord.js'),
	utils = require('../../../../utils');

const subcommands = {
	'counting': require('./counting.js'),
	'currency': require('./currency.js'),
	'store': require('./store.js'),
	'tracker': require('./tracker.js')
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
