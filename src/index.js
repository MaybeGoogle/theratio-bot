const fs = require('fs');

module.exports = client => {
	client.commands = new Object();

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

	client.login(client.config.token);
};