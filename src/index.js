const path = require('path'),
	mongoose = require('mongoose'),
	AdminModule = require('./modules/admin'),
	UserModule = require('./modules/users'),
	CountingModule = require('./modules/counting'),
	CurrencyModule = require('./modules/currency'),
	GamesModule = require('./modules/games'),
	StoreModule = require('./modules/store'),
	HelpModule = require('./modules/help'),
	TrackerModule = require('./modules/tracker'),
	UsersModule = require('./modules/users');
	MessageReactionPollyfill = require('./utils/messageReactionEventPollyfill.js');

const configPath = path.join(__dirname, '../config.json'),
	config = require(configPath),
	modules = [UserModule, AdminModule, CountingModule, CurrencyModule, GamesModule, StoreModule, HelpModule, MessageReactionPollyfill, TrackerModule],
	databaseName = 'theratio',
	mongoURL = 'mongodb://localhost:27017';

module.exports = client => {
	mongoose.connect('mongodb://localhost/theratio', { useNewUrlParser: true });

	mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

	mongoose.connection.on('open', () => {
		client.commands = new Object();
		client.db = new Object();

		modules.forEach(module => module(client));

		client.login(config.token);
	});
};