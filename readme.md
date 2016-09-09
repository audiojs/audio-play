# audio-play [![Build Status](https://travis-ci.org/audiojs/audio-play.svg?branch=master)](https://travis-ci.org/audiojs/audio-play) [![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

Play [audio buffer](https://github.com/audiojs/audio-buffer), browser/node-wise.

## Usage

[![npm install audio-play](https://nodei.co/npm/audio-play.png?mini=true)](https://npmjs.org/package/audio-play/)

```js
const play = require('audio-play');
const load = require('audio-load');

load('./sample.mp3').then(play);
```

## API

```js
//play audio buffer with possible options
let pause = play(audioBuffer, {
	//repeat - bool or number for exact number of repeats
	repeat: false,

	//start time
	start: 0,

	//end time
	end: -0,

	//playback rate
	rate: 1,

	//fine-tune of playback rate, in cents
	detune: 0,

	//possibly existing audio-context, not necessary
	context: require('audio-context'),
});

//pause playback
play = pause();

//continue playback
pause = play();
```
