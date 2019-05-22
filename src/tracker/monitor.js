const request = require('request'),
	path = require('path'),
	fs = require('fs');

const cachePath = path.join(__dirname, 'cache.json');

const monitor = () => {
	const previousCache = require(cachePath);

	request({ url: 'https://trackerstatus.info/api/list/', json: true }, (err, res, json) => {
		if (err) return;

		fs.writeFileSync(cachePath, JSON.stringify(json, null ' '), { encoding: 'utf8' });
	});
};

module.exports = client => {
	const interval = 2000;
	setInterval(monitor, interval);
};
