'use strict';

const play = require('./');
const lena = require('audio-lena/buffer');
const AudioBuffer = require('audio-buffer');

let buf = AudioBuffer(1, lena);

let playback = play(buf, {
	start: 1.2,
	end: 3,
	volume: .5,
	// loop: true,
	rate: 1.1
}, () => {
	console.log('end');
});

setTimeout(() => {
	let play = playback.pause();

	setTimeout(playback.play, 400);
}, 400);
