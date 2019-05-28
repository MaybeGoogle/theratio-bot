const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove'
};

module.exports = client => {
	client.on('raw', async event => {
		if(!events.hasOwnProperty(event.t)) return;

		const { d: data } = event,
			user = client.users.get(data.user_id),
			channel = client.channels.get(data.channel_id) || await user.createDM();

		// if the message is already in the cache, don't re-emit the event
		if(channel.messages.has(data.message_id)) return;

		const message = await channel.fetchMessage(data.message_id);

		if(!message) return;
		
		const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name,
			reaction = message.reactions.get(emojiKey);

		reaction.message = message;

		client.emit(events[event.t], reaction, user);
	});
};
