const request = require('request'),
	path = require('path'),
	fs = require('fs');

const monitor = () => {
	const cachePath = path.join(__dirname, '../../cache.json'),
		cache = require(cachePath);

	request({ url: 'https://trackerstatus.info/api/list/', json: true }, (err, res, json) => {
		if (err) return;

		if(!json) return;

		fs.writeFileSync(cachePath, JSON.stringify(json), { encoding: 'utf8' });
	});
};

module.exports = client => {
	const interval = 2000;
	setInterval(monitor, interval);
};
