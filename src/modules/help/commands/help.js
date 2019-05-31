const Discord = require('discord.js');

module.exports = (client, message, args) => {
	const { channel } = message;

	const embed = {
		title: 'TheRatioBot Command Guide',
		color: 3447003,
		description: 'The following commands are available:',
		fields: [
			{
				name: 'Donate',
				value: 'Donate RatioBucks to another user:\n\n `.donate 10 username`\n'
			},
		],
	};

	channel.send({ embed });
};
