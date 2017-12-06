'use strict';

const play = require('./')
const lena = require('audio-lena/buffer')
const AudioBuffer = require('audio-buffer')
const assert = require('assert')
const context = require('audio-context')()
const t = require('tape')
const load = require('audio-loader')


t('lena', t => {
	let samples = new Float32Array(lena)
	let buf = new AudioBuffer(context, {numberOfChannels: 1, length: samples.length});
	buf.getChannelData(0).set(samples)

	let playback = play(buf, {
		start: 1.2,
		end: 1.29,
		volume: .5,
		loop: true,
		rate: 2
	}, () => {
		console.log('end');
	});


	//TODO
	// setInterval(() => {
	// 	playback.rate *= 1.5
	// }, 10)

	setTimeout(() => {
		let play = playback.pause();

		assert(playback.currentTime);

		setTimeout(() => {
			playback.play();
		}, 500);
		setTimeout(() => {
			playback.pause();

			t.end()
		}, 1000);
	}, 500);
})

t('long sample file', t => {
	let loaded = false
	load('./soundtest.wav', (err, buf) => {
		if (loaded) return
		loaded = true
		play(buf, e => {
			t.end()
		})
	})
})
