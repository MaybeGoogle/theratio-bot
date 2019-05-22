const trackers = ['ar','btn','ggn','mtv','nwcd','ptp','red','32p','ops'];

const trackerFunc = tracker => (client, message, args) => {
	const { channel } = message;
	const { user: { username, avatarURL } } = client;

	request({ url: 'https://trackerstatus.info/api/list/', json: true }, (err, res, json) => {
		if(err) {
			channel.send("Could not communicate with trackerstatus.info's API. Please try again later.");
			return;
		}

		const trackerStatus = json[tracker];

		if(!trackerStatus) {
			channel.send("Could not find information for that tracker in trackerstatus.info's API. Please try again.");
			return;
		}

		const services = trackerStatus.Services;

		const embed = {
			color: 3447003,
			author: {
				name: username,
				icon_url: avatarURL
			},
			title: `Tracker service status for ${tracker.toUpperCase()}`
			fields: [],
			timestamp: new Date(),
		};

		for (let name in services) {
			const value = services[name];
			
			embed.fields.push({ name, value });
		}

		channel.send({ embed });
	});
};

module.exports = client => {
	
	trackers.forEach(tracker => {
		client.commands[tracker + '-status'] = trackerFunc(tracker);
	};

};
