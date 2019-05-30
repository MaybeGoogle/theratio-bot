const path = require('path'),
	fs = require('fs'),
	mongoose = require('mongoose'),
	UserModule = require('./users/index.js'),
	CountingModule = require('./counting/index.js'),
	TrackerModule = require('./tracker/index.js'),
	MessageReactionPollyfill = require('./utils/messageReactionEventPollyfill.js');

const configPath = path.join(__dirname, '../config.json'),
	config = require(configPath);

const databaseName = 'theratio',
	mongoURL = 'mongodb://localhost:27017';

module.exports = client => {
	mongoose.connect('mongodb://localhost/theratio', { useNewUrlParser: true });

	const database = mongoose.connection;

	database.on('error', console.error.bind(console, 'connection error:'));

	database.on('open', () => {
		client.commands = new Object();

		UserModule(client);
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
	});
};