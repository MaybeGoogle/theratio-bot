module.exports = (client, message, args) => {
	const { channel } = message;

	channel.send('Goodbye ' + message.author.username);
};