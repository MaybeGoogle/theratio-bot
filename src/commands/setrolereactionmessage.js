const Discord = require('discord.js'),
	path = require('path'),
	fs = require('fs');

const configPath = path.join(__dirname, '../../config.json');

const trackers = ['ar','btn','ggn','mtv','nwcd','ptp','red','32p','ops'],
	trackerNames = ['Alpha Ratio', 'BTN', 'GGN','MTV','NotWhatCD','PTP','Red','32 Pages','Orpheus'], 
	roles = ['ar-notify','btn-notify','ggn-notify','mtv-notify','nwcd-notify','ptp-notify','red-notify','32p-notify','ops-notify'],
	reactions = ['1⃣','2⃣','3⃣','4⃣','5⃣','6⃣','7⃣','8⃣','9⃣'];

const roleExists = (guild, roleName) => !!guild.roles.find(role => role.name === roleName);

const generateEmbedFields = () => trackers.map((tracker, index) => {
	return {
		tracker,
		role: roles[index],
		reaction: reactions[index],
		trackerName: trackerNames[index]
	};
});

module.exports = (client, message, args) => {
	const { channel } = message;

	const config = require(configPath);

	if(!config.botNotificationRoleChannelID) {
		channel.send('Bot notification channel ID not set');
		return;
	}

	if(channel.id !== config.botNotificationRoleChannelID) {
		console.log('Wrong botNotificationRoleChannelID');
		return;
	}

	const embed = new Discord.RichEmbed()
		.setTitle('Tracker Status Notification Reaction Roles')
		.setColor(3447003)
		.setDescription('React with the corresponding emoji below to receive status notifications for the associated tracker. To remove the role, simply remove the reaction.');

	const fields = generateEmbedFields();

	for(const field of fields) {
		if(!roleExists(message.guild, field.role)) {
			throw `The role ${field.role} does not exist!;`
		}

		embed.addField(field.trackerName, field.reaction, true);
	}

	channel.send(embed).then(async message => {
		for(const reaction of reactions) {
			await message.react(reaction);
		}

		config.botNotificationRoleMessageID = message.id;

		fs.writeFileSync(configPath, JSON.stringify(config), { encoding: 'utf8' });
	});
};
