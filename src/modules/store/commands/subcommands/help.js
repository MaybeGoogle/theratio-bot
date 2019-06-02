const Discord = require('discord.js');

const fields = [
	{
		name: "Pink",
		value: "$300",
		inline: true
	},
	{
		name: "Green",
		value: "$600",
		inline: true
	},
	{
		name: "Purple",
		value: "$900",
		inline: true
	},
	{
		name: "Red",
		value: "$1200",
		inline: true
	}
];

const getDescription = () => {
	return `
		The following roles are available:
	`;
};

module.exports = (client, message, args) => {
	const { channel } = message;

	const embed = {
		title: 'TheRatioBot RatioBuck Role Store',
		color: 3447003,
		description: getDescription(),
		fields
	};

	channel.send({ embed });
};
