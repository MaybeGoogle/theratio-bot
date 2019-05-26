const Discord = require('discord.js');

module.exports = (client, message, args) => {
	const { channel } = message;

	const embed = new Discord.RichEmbed()
		.setColor(3447003)
		.setTitle('TheRatioBot Command Guide')
		.setDescription('The following commands are available:');

	channel.send(embed);
};
