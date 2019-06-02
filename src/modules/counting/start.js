const fs = require('fs'),
	utils = require('../../utils'),
	path = require('path');

const configPath = path.join(__dirname, '../../../config.json');

const greenEmoji = '✅',
	redEmoji = '❌';

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

					setTimeout(async () => {
						await message.delete();
						await reply.delete();
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
			await message.delete();
			return;
		}

		const previousNumber = getNumberFromMessageText(previousMessage.content);

		if(String(previousNumber)[0] == '-') {
			await previousMessage.delete();
		}

		if(!previousNumber) {
			await previousMessage.delete();
			await message.delete();
			return;
		}

		if(number === (previousNumber + 1)) {
			if(author.id == config.lastCountUserId) {
				await message.delete();
				return;
			}

			await message.react(greenEmoji);

			try {
				let user = await client.db.User.findOne({ userId: author.id }).exec();

				if(user) {
					user.wallet = user.wallet + utils.random(1, 5);
					user.numberOfCounts = user.numberOfCounts + 1;

					await user.save();
				} else {
					user = new client.db.User({
						userId: author.id,
						wallet: utils.random(1, 5),
						numberOfCounts: 1
					});

					await user.save();
				}

				config.lastCountUserId = author.id;
				fs.writeFileSync(configPath, JSON.stringify(config), { encoding: 'utf8' });
			} catch(error) {
				console.log(error);
			}
		} else {
			await message.delete();
		}

	} catch(error) {
		console.log(error);
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
		await newMessage.delete();
	}
};

module.exports = client => {
	client.on('message', CountMessageReceiveEvent.bind(null, client));
	client.on('messageUpdate', CountMessageUpdateEvent.bind(null, client));
};
