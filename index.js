/** @module  audio-play, play audio buffer in node */

'use strict';

const AudioSource = require('audio-source/direct');
const AudioSpeaker = require('audio-speaker/direct');
const isAudioBuffer = require('is-audio-buffer');
const AudioBuffer = require('audio-buffer');

module.exports = function (buffer, how, cb) {
	if (!isAudioBuffer(buffer)) throw Error('Argument should be an audio buffer');

	if (how instanceof Function) {
		cb = how;
	}

	how = how || {};
	cb = cb || (() => {});

	if (how.offset == null) how.offset = 0;
	if (how.start == null) how.start = 0;
	if (how.end == null) how.end = buffer.duration;
	how.start = normTime(how.start, buffer.duration);
	how.end = normTime(how.end, buffer.duration);


	//prepare buffer - slice to duration
	if (how.start != 0 && how.end != buffer.duration) {
		let start = Math.floor(how.start * buffer.sampleRate);
		let end = Math.floor(how.end * buffer.sampleRate);
		let slicedBuffer = new AudioBuffer(buffer.numberOfChannels, end - start, buffer.sampleRate);
		for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
			slicedBuffer.getChannelData(channel).set(
				buffer.getChannelData(channel).subarray(start, end)
			);
		}
		buffer = slicedBuffer;
	}

	//TODO: somewhere here goes rate mapping, volume and detune

	let read = AudioSource(buffer, {
		loop: how.loop
	}, cb);
	let write = AudioSpeaker({
		channels: buffer.numberOfChannels,
		sampleRate: buffer.sampleRate
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
			if (err) return cb && cb(err);
			if (!isPlaying) return;

			buf = read(buf);
			write(buf, loop);
		}());

		return pause;
	}

	function pause () {
		if (!isPlaying) return;
		isPlaying = false;

		return play;
	}
}

function normTime (time, duration) {
	return time < 0 ? (duration + (time % duration)) : Math.min(duration, time);
}
