'use strict';

let logEl;
let isInitialized = false;

const createElement = (tag, css) => {
    const element = document.createElement(tag);
    element.style.cssText = css;
    return element;
};

const createPanel = (options) => {
    if (!isInitialized) {
        throw 'You need to call `screenLog.init()` first.';
    }
    options = options || {};
    options.bgColor = options.bgColor || 'black';
    options.color = options.color || 'lightgreen';
    options.css = options.css || '';

    return createElement(
        'div',
        'display:none;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:bold;padding:8px;text-align:left;opacity:0.7;position:fixed;right:0;bottom:0;min-width:260px;max-height:50vh;overflow:auto;z-index:9999;background:'
        + options.bgColor + ';color:'
        + options.color + ';'
        + options.css
    );
};

const log = (data, colorStyle) => {
    if (!isInitialized) {
        throw 'You need to call `screenLog.init()` first.';
    }

    const el = createElement('div', 'white-space: pre;line-height:18px;background:' +
        (logEl.children.length % 2 ? 'rgba(255,255,255,0.1);' : 'inherit;') +
        (colorStyle ? 'color:' + colorStyle : '')); // zebra lines
    //el.textContent = [].slice.call(arguments).reduce(function(prev, arg) {
    //    return prev + ' ' + arg;
    //}, '');

    el.textContent = Array.isArray(data) ? data.join('\n') : data;

    // If any elements, show log element
    logEl.style.removeProperty('display');


    logEl.appendChild(el);
    // Scroll to last element
    logEl.scrollTop = logEl.scrollHeight - logEl.clientHeight;
};

const clear = () => {
    if (!isInitialized) {
        throw 'You need to call `screenLog.init()` first.';
    }
    logEl.innerHTML = '';
};

const init = (options) => {
    isInitialized = true;
    options = options || {};
    logEl = createPanel(options);
    document.body.appendChild(logEl);

    if (!options.freeConsole) {
        console.log = log;
        console.clear = clear;
    }
};

// Public API
export default {
    init,
    log,
    clear
};
