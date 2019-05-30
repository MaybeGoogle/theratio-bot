const asyncLib = require('async'),
	path = require('path'),
	utils = require('../utils/index.js');

const configPath = path.join(__dirname, '../../config.json');

module.exports = async (client, message, args) => {
	const { channel, guild } = message,
		config = utils.requireUncached(require, configPath);
		clientUser = client.user;

	if(channel.id !== config.countSpamChannelID) {
		return;
	}

	const users = await client.User.find().sort({ wallet: -1 }).limit(10).exec();

	if(!users.length) {
		channel.send(utils.generateErrorEmbed('Not enough user data'));
		return;
	}

	const embed = {
		color: 0x0099ff,
		title: "RatioBuck Rich List",
		fields: [],
		timestamp: new Date(),
	};

	let index = 1;

	asyncLib.each(users, async (user, callback) => {
		try { 
			const member = await guild.fetchMember(user.userId);

			embed.fields.push({
				name: `${index}: ${member.displayName}`,
				value: '$' + user.wallet,
				inline: true
			});

			index++;
		} catch(error) {

		}

	}, async (err, result) => {
		await channel.send({ embed });
	});

};
