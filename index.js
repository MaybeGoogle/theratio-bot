const Discord = require('discord.js'),
	App = require('./src/index.js'),
	client = new Discord.Client();

client.config = require('./config.json');

App(client);