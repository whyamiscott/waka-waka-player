# Waka Waka Player

A simple HTML5 custom video player with interactive subtitles.

[Watch demo](https://whyamiscott.github.io/waka-waka-player/)

## Features
* Simple and clear UI;
* Navigation to previous or next subtitle;
* Interaction with words in subtitles;
* MVC architecture of library.

## Getting started

#### Set up HTML markup  
```
<div class="player" id="p_container">
    <div class="player__ui" id="p_ui">
        <div class="player__subtitles" id="p_subtitles"></div>
        <div class="player__controls">
            <div class="player__progress-bar" id="p_progress-bar">
                <div class="player__bar player__bar--buffered", id="p_buffered-bar"></div>
                <div class="player__bar player__bar--watched", id="p_watched-bar"></div>
            </div>
            <div class="player__buttons">
                <div class="player__e-wrapper">
                    <button class="player__button player__button--sub player__button--prev" id="p_prev-sub"></button>
                </div>
                <div class="player__e-wrapper player__e-wrapper--play">
                    <button class="player__button player__button--play" id="p_play"></button>
                </div>
                <div class="player__e-wrapper">
                    <button class="player__button player__button--sub player__button--next" id="p_next-sub"></button>
                </div>
                <div class="player__e-wrapper player__e-wrapper--time">
                    <p class="player__time"><span id="p_current-time">00:00:00</span> / <span id="p_duration">00:00:00</span></p>
                </div>
                <div class="player__e-wrapper player__e-wrapper--volume-icon"></div>
                <div class="player__e-wrapper player__e-wrapper--volume">
                    <div class="player__volume" id="p_volume">
                        <div class="player__volume-value" id="p_volume-value"></div>
                        <div class="player__volume-control" id="p_volume-control"></div>
                    </div>
                </div>
                <button class="player__button player__button--fullscreen" id="p_fullscreen"></button>
            </div>
        </div>
    </div>
    <video class="player__video" src="video.m4v" poster="poster.jpg" preload="metadata" id="p_video"></video>
</div>
```
> Don't forget to change src attribute for VIDEO tag
#### Move the /waka-waka-player folder into your project
#### Add waka-waka-player.min.css in your HEAD tag
```
<link rel="stylesheet" type="text/css" href="waka-waka-player/waka-waka-player.min.css"/>
```
#### Add waka-waka-player.min.js before your closing BODY tag
```
<script type="text/javascript" src="waka-waka-player/waka-waka-player.min.js"></script>
```
#### Initialize your player in your script or an inline script tag
```javascript
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
		// your code here
	}
});
```

## Subtitles specification
Subtitles is an array of objects that contains properties: start, end and text.
### Example:
```javascript
[{"start":5130,"end":8167,"text":"<i>I've always been able</i>\n<i>to sleep through anything.</i>"},{"start":8383,"end":12137,"text":"<i>Storms, sirens, you name it.</i>\n<i>Last night, I didn't sleep.</i>"},{"start":14889,"end":17767,"text":"<i>I guess I get a little goofy</i>\n<i>when I'm nervous.</i>"},{"start":20937,"end":23212,"text":"<i>You see, today isn't just any other day.</i>"},{"start":23398,"end":24672,"text":"<i>It's my first day.</i>"},{"start":24816,"end":26135,"text":"I'm the man."}]
```

## How I use this player
I use Waka Waka Player to watch tv shows in english. In wordFunction() I call the [Yandex.Translate API](https://tech.yandex.ru/translate/) and translate words that I don't know. In this way I skill up my english.

## License and copyright

The MIT License (MIT)

© 2016 Alexander Gladkikh
