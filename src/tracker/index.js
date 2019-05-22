const TrackerCommands = require("./commands.js"),
	TrackerMonitor = require("./monitor.js");

module.exports = client => {
	TrackerCommands(client);
	TrackerMonitor(client);
};
