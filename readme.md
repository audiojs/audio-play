# audio-play [![Build Status](https://travis-ci.org/audiojs/audio-play.svg?branch=master)](https://travis-ci.org/audiojs/audio-play) [![unstable](https://img.shields.io/badge/stability-unstable-green.svg)](http://github.com/badges/stability-badges) [![Greenkeeper badge](https://badges.greenkeeper.io/audiojs/audio-play.svg)](https://greenkeeper.io/)

Play [audio buffer](https://github.com/audiojs/audio-buffer), browser/node-wise.

## Usage

[![npm install audio-play](https://nodei.co/npm/audio-play.png?mini=true)](https://npmjs.org/package/audio-play/)

```js
const play = require('audio-play');
const load = require('audio-loader');

load('./sample.mp3').then(play);
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

  //device (for use with NodeJS, optional)
  device: 'hw:1,0',

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

//get played time
playback.currentTime;
```

### Related

* [audio-loader](https://github.com/audiojs/audio-loader) — load AudioBuffer from any audio source.
* [audio-decode](https://github.com/audiojs/audio-decode) — decode audioBuffer
