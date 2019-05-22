module.exports = (client, message) => {
	const { author, content, channel } = message;
	
	if (author.bot) {
		return;
	}

	if (content.indexOf(client.config.prefix) !== 0) {
		return;
	}

	const args = content.slice(client.config.prefix.length).trim().split(/ +/g);

	const command = args.shift().toLowerCase(),
		handler = client.commands[command];
	
	if(handler) {
		handler(client, message, args);
	}
};