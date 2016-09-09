/** @module  audio-play Play buffer in browser via WAA */

'use strict';

let context = require('audio-context');

module.exports = function (buffer, how) {
	how = how || {};

	let ctx = how.context || context;
	let sourceNode = ctx.createBufferSource();
	sourceNode.buffer = buffer;
	sourceNode.connect(ctx.destination);

	//FIXME: repeats
	if (how.loop || how.repeat) sourceNode.loop = true;
	if (how.detune != null) sourceNode.detune = how.detune;
	if (how.start != null) sourceNode.start = how.start;
	if (how.end != null) sourceNode.end = how.end;
	if (how.rate != null) sourceNode.playbackRate = how.rate;

	return play;

	//FIXME: end event

	function play () {
		sourceNode.start();
		return pause;
	}

	function pause () {
		sourceNode.pause();
		return play;
	}
}
