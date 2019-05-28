const path = require('path'),
	fs = require('fs'),
	CountingModule = require('./counting/index.js'),
	TrackerModule = require('./tracker/index.js'),
	MessageReactionPollyfill = require('./utils/messageReactionEventPollyfill.js');

const configPath = path.join(__dirname, '../config.json'),
	config = require(configPath);

module.exports = client => {
	client.commands = new Object();

	CountingModule(client);
	MessageReactionPollyfill(client);
	TrackerModule(client);

	fs.readdir('./src/events', (err, files) => {
		if (err) return console.log(err);

		files.forEach(filename => {
			if (!filename.endsWith('.js')) return;

			const event = require(`./events/${filename}`),
				eventName = filename.split(".")[0];

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