'use strict';

const log = require('loglevel');
const screenLog = require('./screenLog').default;

log.setLevel('info');

screenLog.init({freeConsole: true});

log.trace = (data) => {
    console.trace(data);
};
log.table = (data) => {
    console.table(data);
};

log.now = (data, colorStyle) => {
    screenLog.log(data, colorStyle);
};

window.w = log.info;
window.log_on_screen = log.now;
