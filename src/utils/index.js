exports.requireUncached = function(require, module){
    delete require.cache[require.resolve(module)]
    return require(module)
}

exports.trackerInfoHasChanged = (info1, info2) => {
	if(info1.Website != info2.Website) {
		return true;
	}
	if(info1.Tracker != info2.Tracker) {
		return true;
	}
	return false;
};

exports.abInfoHasChanged = (info1, info2) => {
	if(info1.site_status != info2.site_status) {
		return true;
	}
	if(info1.tracker_status != info2.tracker_status) {
		return true;
	}
	return false;
};