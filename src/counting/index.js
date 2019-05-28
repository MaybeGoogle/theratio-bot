const utils = require('../utils'),
	path = require('path');

const greenEmoji = '✅',
	redEmoji = '❌';

const configPath = path.join(__dirname, '../../config.json');

const getNumberFromMessageText = text => {
	const count = text.trim().split(/ +/g).shift();
	return Number(count);
};

const CountMessageReceiveEvent = async (client, message) => {
	const config = utils.requireUncached(require, configPath),
		{ author, content, channel } = message,
		{ countChannelID } = config;

	if(author.bot) {
		return;
	}

	if(!countChannelID || channel.id !== countChannelID) {
		return;
	}

	const number = getNumberFromMessageText(content);

	if(isNaN(number) || String(number)[0] == '-') {
		message.delete();
		return;
	}

	try {
		const previousMessageCollection = await channel.fetchMessages({ limit: 10, before: message.id });

		let previousMessage = previousMessageCollection.first();

		if(!previousMessage) {
			if(number === 1) {
				message.react(greenEmoji);
			} else {
				try {
					const reaction = message.react(redEmoji),
						reply = await channel.send('You must start with the number 1. Do you even understand how this game works?');

					setTimeout(() => {
						message.delete();
						reply.delete();
					}, 3000);
				} catch(error) {
					console.log(error);
				}
			}
			return;
		}

		if(previousMessage.edits.length) {
			previousMessage = previousMessage.edits[0];
		}

		if(author.id == previousMessage.author.id) {
			message.delete();
			return;
		}

		const previousNumber = getNumberFromMessageText(previousMessage.content);

		if(String(previousNumber)[0] == '-') {
			previousMessage.delete();
		}

		if(!previousNumber) {
			previousMessage.delete();
			message.delete();
			return;
		}

		if(number === (previousNumber + 1)) {
			message.react(greenEmoji);
		} else {
			message.delete();
		}

	} catch(error) {

	}
};

const CountMessageUpdateEvent = async (client, oldMessage, newMessage) => {
	const config = utils.requireUncached(require, configPath),
		{ author, content, channel } = newMessage,
		{ countChannelID } = config;

	if(author.bot) {
		return;
	}

	if(!countChannelID || channel.id != countChannelID) {
		return;
	}

	const newNumber = getNumberFromMessageText(content),
		oldNumber = getNumberFromMessageText(oldMessage.content);

	if(newNumber != oldNumber) {
		newMessage.delete();
	}
};

module.exports = client => {
	client.on('message', CountMessageReceiveEvent.bind(null, client));
	client.on('messageUpdate', CountMessageUpdateEvent.bind(null, client));
};
