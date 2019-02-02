const prerender = require('prerender');

const server = prerender({
    port: 3010,
    chromeLocation: '/usr/bin/chromium-browser'
});

server.start();
