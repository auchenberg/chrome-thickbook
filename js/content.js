chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		var n = document.getElementById('meteroverlay');
	    n.parentNode.style.overflow = 'visible';
	    n.parentNode.removeChild(n);
	    n = document.getElementById('teaserwrapper');
	    n.parentNode.removeChild(n);

	}, 10);
});