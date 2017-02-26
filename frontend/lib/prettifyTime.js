module.exports = (milliseconds) => (milliseconds > 999) ? (milliseconds / 1000).toFixed(2) + " s" : milliseconds + ' ms';
