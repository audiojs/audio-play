/** @module  audio-play, play audio buffer in node */

'use strict';

const AudioSource = require('audio-source/direct');
const AudioSpeaker = require('audio-speaker/direct');
const isAudioBuffer = require('is-audio-buffer');
const AudioBuffer = require('audio-buffer');
const AudioBufferUtils = require('audio-buffer-utils');
const idx = require('negative-index');

module.exports = function (buffer, how, cb) {
	if (!isAudioBuffer(buffer)) throw Error('Argument should be an audio buffer');

	if (how instanceof Function) {
		cb = how;
	}

	how = how || {};
	cb = cb || (() => {});

	if (how.currentTime == null) how.currentTime = 0;
	if (how.start == null) how.start = 0;
	if (how.end == null) how.end = buffer.duration;
	if (how.volume == null) how.volume = 1;
	how.start = idx(how.start, buffer.duration);
	how.end = idx(how.end, buffer.duration);

	//prepare buffer - slice to duration
	if (how.start != 0 || how.end != buffer.duration) {
		let start = Math.floor(how.start * buffer.sampleRate);
		let end = Math.floor(how.end * buffer.sampleRate);
		let slicedBuffer = new AudioBuffer(null, {
			numberOfChannels: buffer.numberOfChannels,
			length: end - start,
			sampleRate: buffer.sampleRate
		});
		for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
			slicedBuffer.getChannelData(channel).set(
				buffer.getChannelData(channel).subarray(start, end)
			);
		}
		buffer = slicedBuffer;
	}
	
	// apply volume
	buffer = AudioBufferUtils.fill(buffer, v => v * how.volume)

	//TODO: somewhere here goes rate mapping and detune

	let read = AudioSource(buffer, {
		loop: how.loop
	}, () => {
		//node-speaker fix: we send 2s of silence
		write(new AudioBuffer(null, {
			length: buffer.sampleRate * 2,
			numberOfChannels: buffer.numberOfChannels,
			sampleRate: buffer.sampleRate
		}));
	});
	let write = AudioSpeaker({
		channels: buffer.numberOfChannels,
		sampleRate: buffer.sampleRate,
		device: how.device
	});

	//provide API
	play.play = pause.play = play;
	play.pause = pause.pause = pause;

	let isPlaying = false;

	return how.autoplay != false ? play() : play;

	function play () {
		if (isPlaying) return;

		isPlaying = true;

		(function loop (err, buf) {
			if (err) {
				return cb(err);
			}
			if (!isPlaying) return;

			buf = read(buf);
			
			if (!buf) {
				pause()
				return
			}

			//track current time
			how.currentTime += buf.duration
			play.currentTime = pause.currentTime = how.currentTime

			write(buf, loop);
		}());

		return pause;
	}

	function pause () {
		if (!isPlaying) return;
		isPlaying = false;
		cb()

		return play;
	}
}
