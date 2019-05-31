const path = require('path'),
	fs = require('fs'),
	_ = require('lodash'),
	utils = require('../../../utils');

const configPath = path.join(__dirname, '../../../../config.json');

const roles = ['ar-notify','btn-notify','ggn-notify','mtv-notify','nwcd-notify','ptp-notify','red-notify','32p-notify','ops-notify','ab-notify'],
	reactions = ['1⃣','2⃣','3⃣','4⃣','5⃣','6⃣','7⃣','8⃣','9⃣','🔟'];

module.exports = (thing, reaction, user) => {
	const { message } = reaction;

	if(user.bot) return;	

	if(!message || !message.guild) return;

	const config = utils.requireUncached(require, configPath);

	if(message.id !== config.botNotificationRoleMessageID) return;

	reactions.forEach((reactionName, index) => {
		if(reaction.emoji.name != reactionName) return;

		const role = message.guild.roles.find(r => r.name === roles[index]);

		if(role) {
			message.guild.member(user).addRole(role);
		}
	});
};
