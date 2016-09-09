'use strict';

const play = require('./');
const lena = require('audio-lena/buffer');

play(lena, {
	start: .2,
	end: .3,
	repeat: 4,
	rate: .9
});
