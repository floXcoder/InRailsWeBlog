import log from 'loglevel';

import screenLog from '@js/modules/screenLog';

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

export default window.w;