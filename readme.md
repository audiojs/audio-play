# audio-play

> **Deprecated.** This package is archived and no longer maintained. Its functionality is being folded into the [`audio`](https://github.com/audiojs/audio) package. For direct use, the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) covers the browser case natively, and [`audio-speaker`](https://github.com/audiojs/audio-speaker) handles node output.

Play [audio buffer](https://github.com/audiojs/audio-buffer), browser/node-wise.

## Usage

[![npm install audio-play](https://nodei.co/npm/audio-play.png?mini=true)](https://npmjs.org/package/audio-play/)

```js
const play = require('audio-play');
const load = require('audio-loader');

load('./sample.mp3').then(play);
```

### Browser replacement

```js
let context = new AudioContext();
let source = context.createBufferSource();
source.buffer = audioBuffer;
source.connect(context.destination);
source.start();
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

* [audio](https://github.com/audiojs/audio) — high-level audio toolkit.
* [audio-speaker](https://github.com/audiojs/audio-speaker) — output audio to speaker in node/browser.
* [audio-decode](https://github.com/audiojs/audio-decode) — decode audio data.
