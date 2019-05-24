const path = require('path'),
	fs = require('fs'),
	_ = require('lodash');

const configPath = path.join(__dirname, '../../config.json');

const trackers = ['ar','btn','ggn','mtv','nwcd','ptp','red','32p','ops'],
	roles = ['ar-notify','btn-notify','ggn-notify','mtv','nwcd','ptp','red','32p','ops'],
	reactions = ['one','two','three','four','five','six','seven','eight','nine'];

module.exports = (reaction, user) => {
	if(user.bot) return;	

	if(!reaction.message.channel.guild) return;

	const config = require(configPath);

	if(reaction.message.id !== config.botNotificationRoleMessageID) return;

	reactions.forEach((reactionName, index) => {
		if(!reaction.emoji.name !== reactionName) return;

		const role = reaction.message.guild.roles.find(r => r.name === roles[index]);
		reaction.message.guild.member(user).removeRole(role);
	});
};
