'use strict';

const play = require('./');
const lena = require('audio-lena/buffer');
const AudioBuffer = require('audio-buffer');
const assert = require('assert')

let buf = AudioBuffer(1, lena);

let playback = play(buf, {
	start: 1.2,
	end: 1.28,
	volume: .5,
	loop: true,
	rate: 1.1
}, err => {
	console.log(err);
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
	setTimeout(() => {
		playback.play();
	}, 1500)
	setTimeout(() => {
		playback.end('testing end')
	}, 2000)
}, 500);
