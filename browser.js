/** @module  audio-play Play buffer in browser via WAA */

'use strict';

const context = require('audio-context');
const isAudioBuffer = require('is-audio-buffer');
function loud (err) { throw err }

module.exports = function Play (buffer, how, cb) {
	if (!isAudioBuffer(buffer)) throw Error('Argument should be an audio buffer');

	if (how instanceof Function) {
		cb = how;
	}

	how = how || {};
	cb = cb || loud;

	if (how.context == null) how.context = context;

	if (how.currentTime == null) how.currentTime = 0;
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

	function end_event (e) {

		end_player()
	}

	sourceNode.addEventListener('ended', end_event);

	//provide API
	play.play = pause.play = play;
	play.pause = pause.pause = pause;
	play.end = pause.end = end_player
	play._sourceNode = sourceNode

	let startTime = 0;
	let isPlaying = false;
	let ended = false

	return how.autoplay !== false ? play() : play;

	function play () {
		if (isPlaying || ended) return pause;

		isPlaying = true;

		startTime = how.context.currentTime;

		if (how.loop) {
			sourceNode.start(startTime, how.start + how.currentTime);
		}
		else {
			sourceNode.start(startTime, how.start + how.currentTime, how.end - how.start);
		}

		return pause;
	}

	function pause () {
		if (!isPlaying || ended) return pause.play;
		isPlaying = false;

		sourceNode.stop();
		sourceNode.removeEventListener('ended', end_event);

		let playedTime = (how.context.currentTime - startTime);

		how.autoplay = false;
		how.currentTime = playedTime;

		let playback = Play(buffer, how, cb);
		play.play = pause.play = playback.play;
		play.pause = pause.pause = playback.pause;
		play.currentTime = pause.currentTime = playback.currentTime = how.currentTime;
		// sourceNode = playback._sourceNode
		// sourceNode.stop()

		return playback;
	}

	function end_player (err) {
		pause()
		ended = true
		cb(err)
	}
}

function normTime (time, duration) {
	return time < 0 ? (duration + (time % duration)) : Math.min(duration, time);
}

function createNode (buffer, how) {
	let sourceNode = how.context.createBufferSource();

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
