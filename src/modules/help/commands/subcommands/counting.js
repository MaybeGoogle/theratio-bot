const Discord = require('discord.js'),
	utils = require('../../../../utils');

const getDescription = () => {
return `
Count to earn RatioBucks. Each count is rewarded with a random number of RatioBucks between 1 and 5. Spend RatioBucks in the store for various perks.
`;
};

module.exports = (client, message, args) => {
	const { channel } = message;

	const embed = {
		title: 'Counting Help',
		color: 3447003,
		description: getDescription()
	};

	channel.send({ embed });
};
