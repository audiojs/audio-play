/** @module  audio-play Play buffer in browser via WAA */

'use strict';

const context = require('audio-context');
const isAudioBuffer = require('is-audio-buffer');

module.exports = function Play (buffer, how, cb) {
	if (!isAudioBuffer(buffer)) throw Error('Argument should be an audio buffer');

	if (how instanceof Function) {
		cb = how;
	}

	how = how || {};
	cb = cb || (() => {});

	if (how.context == null) how.context = context;

	if (how.offset == null) how.offset = 0;
	if (how.start == null) how.start = 0;
	if (how.end == null) how.end = buffer.duration;
	how.start = normTime(how.start, buffer.duration);
	how.end = normTime(how.end, buffer.duration);

	let sourceNode = createNode(buffer, how);

	if (!how.gain) {
		how.gain = how.context.createGain();
		how.gain.gain.value = how.volume == null ? 1 : how.volume;
		how.gain.connect(context.destination);
	}
	sourceNode.connect(how.gain);

	sourceNode.addEventListener('ended', cb);

	//provide API
	play.play = pause.play = play;
	play.pause = pause.pause = pause;

	return how.autoplay != false ? play() : play;

	var startTime = 0;
	var isStarted = true;

	function play () {
		if (isStarted) return;

		isStarted = true;

		startTime = how.context.currentTime;

		if (how.loop) {
			sourceNode.start(startTime, how.start + how.offset);
		}
		else {
			sourceNode.start(startTime, how.start + how.offset, how.end - how.start);
		}

		return pause;
	}

	function pause () {
		sourceNode.stop();
		sourceNode.removeEventListener('ended', cb);

		let playedTime = (how.context.currentTime - startTime);

		how.autoplay = false;
		how.offset = playedTime;

		pause.play = Play(buffer, how, cb);

		return pause.play;
	}
}

function normTime (time, duration) {
	return time < 0 ? (duration + (time % duration)) : Math.min(duration, time);
}

function createNode (buffer, how) {
	let sourceNode = how.context.createBufferSource();
	let destination = how.context.destination;

	sourceNode.buffer = buffer;

	//init options
	if (how.detune != null) sourceNode.detune = how.detune;
	if (how.rate != null) sourceNode.playbackRate.value = how.rate;


	if (how.loop) {
		sourceNode.loop = true;
		sourceNode.loopStart = how.start;
		sourceNode.loopEnd = how.end;
	}

	return sourceNode;
}
