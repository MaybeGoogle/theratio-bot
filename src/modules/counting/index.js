const fs = require('fs'),
	path = require('path'),
	start = require('./start.js');

module.exports = client => {

	start(client);

	fs.readdir(`${__dirname}/events`, (err, files) => {
		if (err) return console.log(err);

		files.forEach(filename => {
			if (!filename.endsWith('.js')) return;

			const event = require(`./events/${filename}`),
				eventName = filename.split(".")[0];

			client.on(eventName, event.bind(null, client));
		});
	});

	fs.readdir(`${__dirname}/commands`, (err, files) => {
		if (err) return console.log(err);

		files.forEach(filename => {
			if (!filename.endsWith('.js')) return;

			const command = require(`./commands/${filename}`),
				commandName = filename.split(".")[0];
				
			client.commands[commandName] = command;
		});
	});

};
