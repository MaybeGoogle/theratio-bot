const config = require('../../../../config.json');

module.exports = (client, message) => {
	const { author, content, channel } = message;
	
	if(author.bot) {
		return;
	}

	if(content.indexOf(config.prefix) !== 0) {
		return;
	}

	const args = content.slice(config.prefix.length).trim().split(/ +/g);

	const command = args.shift().toLowerCase(),
		handler = client.commands[command];
	
	if(handler) {
		handler(client, message, args);
	}
};