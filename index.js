/** @module  audio-play, play audio buffer in node */

'use strict';

const AudioSource = require('audio-source/direct');
const AudioSpeaker = require('audio-speaker/direct');
const isAudioBuffer = require('is-audio-buffer');
const AudioBuffer = require('audio-buffer');
const idx = require('negative-index');
function loud (err) { throw err }

module.exports = function (buffer, how, cb) {
	if (!isAudioBuffer(buffer)) throw Error('Argument should be an audio buffer');

	if (how instanceof Function) {
		cb = how;
	}

	how = how || {};
	cb = cb || loud;

	if (how.currentTime == null) how.currentTime = 0;
	if (how.start == null) how.start = 0;
	if (how.end == null) how.end = buffer.duration;
	how.start = idx(how.start, buffer.duration);
	how.end = idx(how.end, buffer.duration);


	//prepare buffer - slice to duration
	if (how.start != 0 || how.end != buffer.duration) {
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
	}, () => {
		//node-speaker fix: we send 2s of silence
		write(AudioBuffer(buffer.sampleRate * 2));
		// cb(true)
	});
	let write = AudioSpeaker({
		channels: buffer.numberOfChannels,
		sampleRate: buffer.sampleRate
	});

	//provide API
	play.play = pause.play = play;
	play.pause = pause.pause = pause;
	play.end = pause.end = end_player

	let isPlaying = false;
	let ended = false

	return how.autoplay != false ? play() : play;

	function play () {
		if (isPlaying || ended) return;

		isPlaying = true;

		(function loop (err, buf) {
			if (!isPlaying || ended) return;
			if (err) return end_player(err);

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
		if (!isPlaying || ended) return;
		isPlaying = false;

		return play;
	}

	function end_player (err) {
		isPlaying = false
		ended = true
		read.end()
		write.end()
		cb(err)
	}
}
