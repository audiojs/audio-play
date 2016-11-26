'use strict';

const play = require('./');
const lena = require('audio-lena/buffer');
const AudioBuffer = require('audio-buffer');
const assert = require('assert')

let buf = AudioBuffer(1, lena);

let playback = play(buf, {
	start: 1.2,
	end: 1.45,
	volume: .5,
	loop: true,
	rate: 1.1
}, () => {
	console.log('end');
});

setTimeout(() => {
	let play = playback.pause();

	assert(playback.currentTime);

	setTimeout(() => {
		playback.play();
	}, 500);
	setTimeout(() => {
		playback.pause();
	}, 1000);
}, 500);
