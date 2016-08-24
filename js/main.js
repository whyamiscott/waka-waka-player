var subs = [{"start":5130,"end":8167,"text":"<i>I've always been able</i>\n<i>to sleep through anything.</i>"},{"start":8383,"end":12137,"text":"<i>Storms, sirens, you name it.</i>\n<i>Last night, I didn't sleep.</i>"},{"start":14889,"end":17767,"text":"<i>I guess I get a little goofy</i>\n<i>when I'm nervous.</i>"},{"start":20937,"end":23212,"text":"<i>You see, today isn't just any other day.</i>"},{"start":23398,"end":24672,"text":"<i>It's my first day.</i>"},{"start":24816,"end":26135,"text":"I'm the man."},{"start":35577,"end":38614,"text":"<i>Three years of pre-med</i>\n<i>and four years of med school</i>"},{"start":38830,"end":40707,"text":"<i>have made me realise one thing...</i>"},{"start":40874,"end":43911,"text":"Could you drop an NG tube\non the patient in 234"},{"start":44127,"end":45924,"text":"and then call the attending?"},{"start":46087,"end":47918,"text":"<i>...I don't know Jack.</i>"}];

wwp({
	video: document.getElementById('p_video'),
	playerContainer: document.getElementById('p_container'),
	ui: {
		playBtn: document.getElementById('p_play'),
		volume: document.getElementById('p_volume'),
		volumeValue: document.getElementById('p_volume-value'),
		volumeControl: document.getElementById('p_volume-control'),
		currentTime: document.getElementById('p_current-time'),
		duration: document.getElementById('p_duration'),
		fullscreenBtn: document.getElementById('p_fullscreen'),
		prevSub: document.getElementById('p_prev-sub'),
		nextSub: document.getElementById('p_next-sub'),
		progressBar: document.getElementById('p_progress-bar'),
		watchedBar: document.getElementById('p_watched-bar'),
		bufferedBar: document.getElementById('p_buffered-bar'),
		subtitles: document.getElementById('p_subtitles')
	},
	subtitles: subs,
	wordFunction: function(word) {
		alert(word.toUpperCase());
	}
});