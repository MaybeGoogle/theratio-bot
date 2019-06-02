exports.requireUncached = function requireUncached(require, module) {
    delete require.cache[require.resolve(module)]
    return require(module)
}

exports.isPositiveInteger = (n) => {
    return n >>> 0 === parseFloat(n);
}

exports.generateErrorEmbed = error => {
	return {
		embed: {
			color: 15158332,
			description: error
		}
	};
};

exports.generateSuccessEmbed = description => {
	return {
		embed: {
			color: 0x0099ff,
			description
		}
	};
};

exports.random = (min, max) => {
    return Math.floor(Math.random() * (max-min + 1) + min);
};
