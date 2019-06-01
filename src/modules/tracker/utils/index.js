exports.trackerInfoHasChanged = (info1, info2) => {
	if(info1.Website != info2.Website) {
		if(info1.Website != 2 && info2.Website != 2) {
			return true;
		}
	}
	if(info1.Tracker != info2.Tracker) {
		if(info1.Tracker != 2 && info2.Tracker != 2) {
			return true;
		}
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
