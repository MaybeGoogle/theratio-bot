module.exports = (client, message, args) => {
	const { channel } = message;

	channel.send('Hello ' + message.author.username);
};