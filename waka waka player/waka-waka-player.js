'use strict';

window.wwp = (function(){
	function PlayerView(playerContainer, playBtn, volume, volumeValue, volumeControl, currentTime, duration, fullscreenBtn, progressBar, watchedBar, bufferedBar) {
		this.playerContainer = playerContainer;
		this.playBtn = playBtn;
		this.volume = volume;
		this.volumeValue = volumeValue;
		this.volumeControl = volumeControl;
		this.currentTime = currentTime;
		this.duration = duration;
		this.fullscreenBtn = fullscreenBtn;
		this.progressBar = progressBar;
		this.watchedBar = watchedBar;
		this.bufferedBar = bufferedBar;

		var self = this;

		function changeProgress(bar, val) {
			bar.style.width = val + '%';
		}

		function changeCurrentTime(time) {
			self.currentTime.innerHTML = time;
		}

		this.updateTime = function(currentTime, formatedCurrentTime, duration) {
			var progress = currentTime / duration * 100;
			changeProgress(self.watchedBar, progress);
			changeCurrentTime(formatedCurrentTime);
		}

		this.updateBuffered = function(buffered, duration) {
			var progress = buffered / duration * 100;
			changeProgress(self.bufferedBar, progress);
		}
	}

	function PlayerController(view, model) {
		this.view = view;	
		this.model = model;

		this.model.load();
		this.model.attachObs(view);

		var self = this;

		function setVolumeControls(value) {
			var volumeControlMargin = self.view.volumeControl.clientWidth / 2,
				volumeControlPosition = value / self.view.volume.clientWidth * 100 - volumeControlMargin,
				volumeValueWidth = value;

			self.view.volumeValue.style.width = volumeValueWidth + '%';
			self.view.volumeControl.style.left = volumeControlPosition + 'px';
		}

		function setCurrentTimeAndDuration() {
			var duration = self.model.getDuration(true);

			self.view.duration.innerHTML = duration;
			self.view.currentTime.innerHTML = '00:00:00';
		}

		this.model._video.addEventListener('loadedmetadata', function() {
			setCurrentTimeAndDuration();
			setVolumeControls(self.model.getVolume(true));
		})

		this.view.playBtn.addEventListener('click', function() {
			if (self.model.isPaused()) {
				self.model.play();
				self.view.playBtn.classList.add('player__button--pause');
			} else {
				self.model.pause();
				self.view.playBtn.classList.remove('player__button--pause');
			}
		});

		this.view.progressBar.addEventListener('click', function(e) {
			var duration = self.model.getDuration(),
				time = duration / 100 * ((e.pageX - Math.floor(self.view.progressBar.getBoundingClientRect().left)) / self.view.progressBar.clientWidth * 100);
			
			self.model.setCurrentTime(time);
		});

		this.view.volume.addEventListener('click', function(e) {
			var value = e.pageX - Math.floor(self.view.volume.getBoundingClientRect().left);

			if (value > 100) {
				value = 100;
			} else if (value < 0) {
				value = 0;
			}
			
			setVolumeControls(value);
			self.model.setVolume(value / 100);
		});

		this.view.fullscreenBtn.addEventListener('click', function() {
			if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {  // current working methods
		    	if (document.documentElement.requestFullscreen) {
		      		document.documentElement.requestFullscreen();
		    	} else if (document.documentElement.mozRequestFullScreen) {
		      		document.documentElement.mozRequestFullScreen();
		    	} else if (document.documentElement.webkitRequestFullscreen) {
		      		document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		    	}

		    	self.view.playerContainer.style.width = '100%';
		    	self.view.playerContainer.style.height = '100vh';
		    	self.view.playerContainer.style.position = 'fixed';
		    	self.view.playerContainer.style.left = '0';
		    	self.view.playerContainer.style.top = '0';
		    	self.view.playerContainer.style.zIndex = '9999';
		  	} else {
		    	if (document.cancelFullScreen) {
		      		document.cancelFullScreen();
		    	} else if (document.mozCancelFullScreen) {
		      		document.mozCancelFullScreen();
		    	} else if (document.webkitCancelFullScreen) {
		      		document.webkitCancelFullScreen();
		    	}

		    	self.view.playerContainer.style.width = '';
		    	self.view.playerContainer.style.height = '';
		    	self.view.playerContainer.style.position = '';
		    	self.view.playerContainer.style.left = '';
		    	self.view.playerContainer.style.top = '';
		    	self.view.playerContainer.style.zIndex = '';
		  	}
		});
	}

	function PlayerModel(video) {
		this._video = video;

		var observers = [],
			self = this;

		this.load = function(src) {
			if (src) {
				console.log(src);
			}

			self._video.load();
		}

		this.play = function() {
			self._video.play();
		}

		this.pause = function() {
			self._video.pause();
		}

		this.stop = function() {
			self._video.stop();
		}

		this.isPaused = function() {
			if (self._video.paused) {
				return true;
			} else {
				return false;
			}
		}

		this.setCurrentTime = function(time) {
			self._video.currentTime = time;
		}

		this.getDuration = function(formated) {
			if (formated) {
				var duration = Math.floor(self._video.duration);
				return formateTime(duration);	
			}

			return self._video.duration;
		}

		function formateTime(time) {
			var hours = Math.floor(time / 3600),
				minutes = Math.floor((time - hours * 3600) / 60),
				seconds = time - hours * 3600 - minutes * 60;

			if (minutes < 10) minutes = '0' + minutes;
			if (seconds < 10) seconds = '0' + seconds;

			if (hours) {
				if (hours < 10) hours = '0' + hours;
				return hours + ':' + minutes + ':' + seconds;
			}
			
			return minutes + ':' + seconds;
		}

		this.getCurrentTime = function() {
			return self._video.currentTime;
		}

		this.setVolume = function(volume) {
			self._video.volume = volume;
		}

		this.getVolume = function(inPercentages) {
			if (inPercentages) return self._video.volume * 100;
			
			return self._video.volume;
		}

		this.attachObs = function(o) {
			observers.push(o);
		}

		this._video.addEventListener('timeupdate', function() {
			observers.forEach(function(o) {
				o.updateTime(self._video.currentTime, formateTime(Math.floor(video.currentTime)), video.duration);
			});
		});

		this._video.addEventListener('progress', function() {
			observers.forEach(function(o) {
				if (self._video.readyState === 4) {
					o.updateBuffered(self._video.buffered.end(self._video.buffered.length - 1), self._video.duration);
				}
			});
		});
	}

	function SubtitlesView(subtitlesContainer, prevSubBtn, nextSubBtn, playBtn) {
		this.prevSubBtn = prevSubBtn;
		this.nextSubBtn = nextSubBtn;
		this.playBtn = playBtn;
		this._subtitlesContainer = subtitlesContainer;
		this._subtitleWordClassName = 'player__subtitle-word';

		var self = this;

		this.update = function(subtitleText) {
			if (subtitleText) {
				this._subtitlesContainer.innerHTML = wrapWords(subtitleText);
				this._subtitlesContainer.style.display = 'inline-block';
			} else {
				this._subtitlesContainer.style.display = 'none';
				this._subtitlesContainer.innerHTML = '';
			}
		}

		function wrapWords(subtitleText) {
			return subtitleText.replace(/<(?:.|\n)*?>/gm, '').replace(/(\'?\w+(?:(?:\'|\-)?\w+)*)/g, function(p) {
				return '<span class="' + self._subtitleWordClassName + '">' + p + '</span>';
			});
		}
	}

	function SubtitlesController(sView, sModel, pModel, wordFunction) {
		this.view = sView;
		this.model = sModel;
		this.pModel = pModel;
		this.wordFunction = wordFunction;

		this.model.attachObs(this.view);
		this.pModel.attachObs(this);

		var self = this;

		this.updateTime = function(currentTime, duration) {
			this.model.updateSubtitles(currentTime);
		}

		this.updateBuffered = function(v) {}

		this.view.prevSubBtn.addEventListener('click', function() {
			var time;
			if (time = self.model.getPrevSubtitleTime()) {
				self.pModel.setCurrentTime(time);
			}
		});

		this.view.nextSubBtn.addEventListener('click', function() {
			var time;
			if (time = self.model.getNextSubtitleTime()) {
				self.pModel.setCurrentTime(time);
			}
		});

		this.view._subtitlesContainer.addEventListener('click', function(e) {
			var elem = e.target;

			if (elem.classList.contains(self.view._subtitleWordClassName)) {
				self.wordFunction(elem.innerHTML);
			}
		});

		this.view._subtitlesContainer.addEventListener('mousemove', function() {
			if (!self.pModel.isPaused()) {
				self.view.playBtn.classList.remove('player__button--pause');
				self.pModel.pause();
			}
		});

		this.view._subtitlesContainer.addEventListener('mouseleave', function() {
			if (self.pModel.isPaused()) {
				self.view.playBtn.classList.add('player__button--pause');
				self.pModel.play();
			}
		})
	}

	function SubtitlesModel(subtitles) {
		var subtitles = subtitles;
		var currentSubtitleIndex = -1;
		var nextSubtitleIndex = 0;
		var prevSubtitleIndex = subtitles.length - 1;
		var observers = [];

		var notifyObs = function() {
			observers.forEach(function(o) {
				if (~currentSubtitleIndex) {
					o.update((subtitles[currentSubtitleIndex]).text);
				} else {
					o.update('');
				}
			})
		}

		var changeCurrentSubtitleIndex = function(val) {
			if (currentSubtitleIndex === val) return false; 
			
			setNextPrevSubtitleIndexes(val);
			currentSubtitleIndex = val;
			return true;
		}

		var findSubtitleByTime = function(low, high, time) {
			if (time < subtitles[0].end) {
		    	if (changeCurrentSubtitleIndex(0)) notifyObs();
		    	return;
		    } else if (time > subtitles[subtitles.length-1].end) {
		    	if (changeCurrentSubtitleIndex(-1)) notifyObs();
		    	return;
		    }

		    var mid = Math.floor((low + high) / 2);

		    if (time >= subtitles[mid].start && time < subtitles[mid].end) {
		    	if (changeCurrentSubtitleIndex(mid)) notifyObs();
		    	return;
		    } else if (time > subtitles[mid].end && time < subtitles[mid+1].start) {
		    	if (changeCurrentSubtitleIndex(-1)) notifyObs();
		    	return;
		    } else {
		    	if (time >= subtitles[mid].end) {
		        	return findSubtitleByTime(mid+1, high, time);
		      	} else {
		        	return findSubtitleByTime(low, mid-1, time);
		      	}
			}
		}

		function setNextPrevSubtitleIndexes(i) {
			if (~i) {
				setNextSubtitleIndex(i + 1);
				setPrevSubtitleIndex(i - 1);
			} else {
				setNextSubtitleIndex(currentSubtitleIndex + 1);
				setPrevSubtitleIndex(currentSubtitleIndex);
			}
		} 

		function setNextSubtitleIndex(i) {
			if (i < subtitles.length) {
				nextSubtitleIndex = i;
			} else {
				nextSubtitleIndex = 0;
			}
		}

		function setPrevSubtitleIndex(i) {
			if (i >= 0) {
				prevSubtitleIndex = i;
			} else {
				prevSubtitleIndex = subtitles.length - 1;
			}
		}

		this.getNextSubtitleTime = function() {
			var startTime = subtitles[nextSubtitleIndex]['start'] / 1000;
			changeCurrentSubtitleIndex(nextSubtitleIndex);
			notifyObs();
			return startTime;
		}

		this.getPrevSubtitleTime = function() {
			var startTime = subtitles[prevSubtitleIndex]['start'] / 1000;
			changeCurrentSubtitleIndex(prevSubtitleIndex);
			notifyObs();
			return startTime;
		}

		this.updateSubtitles = function(time) {
			var time = time * 1000;
			if (time > subtitles[0]['start']) {
				findSubtitleByTime(0, subtitles.length, time);
			}
		} 

		this.attachObs = function(o) {
			observers.push(o)
		}
	}

	var wakaWakaPlayer = function(options) {
		if (!options) return false;

		var playerView = new PlayerView(options.playerContainer, options.ui.playBtn, options.ui.volume, options.ui.volumeValue, options.ui.volumeControl, options.ui.currentTime, options.ui.duration, options.ui.fullscreenBtn, options.ui.progressBar, options.ui.watchedBar, options.ui.bufferedBar);
		var playerModel = new PlayerModel(options.video);
		var playerController = new PlayerController(playerView, playerModel);
		var subtitles = subtitles;
		var subtitlesView = new SubtitlesView(options.ui.subtitles, options.ui.prevSub, options.ui.nextSub, options.ui.playBtn);
		var subtitlesModel = new SubtitlesModel(options.subtitles);
		var subtitlesController = new SubtitlesController(subtitlesView, subtitlesModel, playerModel, options.wordFunction);
	}

	return wakaWakaPlayer;
})();