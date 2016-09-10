# audio-play [![Build Status](https://travis-ci.org/audiojs/audio-play.svg?branch=master)](https://travis-ci.org/audiojs/audio-play) [![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

Play [audio buffer](https://github.com/audiojs/audio-buffer), browser/node-wise.

## Usage

[![npm install audio-play](https://nodei.co/npm/audio-play.png?mini=true)](https://npmjs.org/package/audio-play/)

```js
const play = require('audio-play');
const load = require('audio-loader');
const context = require('audio-context');

load(context, './sample.mp3').then(play);
```

## API

```js
const play = require('audio-play');

//play audio buffer with possible options
let pause = play(audioBuffer, {
	//start/end time, can be negative to measure from the end
	start: 0,
	end: audioBuffer.duration,

	//repeat playback within start/end
	loop: false,

	//playback rate
	rate: 1,

	//fine-tune of playback rate, in cents
	detune: 0,

	//volume
	volume: 1,

	//possibly existing audio-context, not necessary
	context: require('audio-context'),

	//start playing immediately
	autoplay: true
}, onend?);

//pause/continue playback
play = pause();
pause = play();

//or usual way
let playback = play(buffer, opts?, cb?);
playback.pause();
playback.play();
```

### Related

* [sample-player](https://github.com/danigb/sample-player), [audio-player](https://github.com/danigb/audio-player) — audio buffer players for browser from @danigb.
