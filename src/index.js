const path = require('path'),
	fs = require('fs'),
	TrackerModule = require('./tracker/index.js'),
	MessageReactionPollyfill = require('./messageReactionPollyfill.js');

const configPath = path.join(__dirname, '../config.json'),
	config = require(configPath);

module.exports = client => {
	client.commands = new Object();

	MessageReactionPollyfill(client);
	TrackerModule(client);

	fs.readdir('./src/events', (err, files) => {
		if (err) return console.log(err);

		files.forEach(filename => {
			if (!filename.endsWith('.js')) return;

			const event = require(`./events/${filename}`);
			const eventName = filename.split(".")[0];

			client.on(eventName, event.bind(null, client));
		});
	});

	fs.readdir('./src/commands', (err, files) => {
		if (err) return console.log(err);

		files.forEach(filename => {
			if (!filename.endsWith('.js')) return;

			const command = require(`./commands/${filename}`),
				commandName = filename.split(".")[0];
				
			client.commands[commandName] = command;
		});
	});

	client.login(config.token);
};