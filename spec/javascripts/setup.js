'use strict';

// Avoid React warning about requestAnimationFrame
global.requestAnimationFrame = (callback) => {
    setTimeout(callback, 0);
};

// Mock localStorage
const localStorageMock = (function() {
    let store = {};

    return {
        getItem: function(key) {
            return store[key];
        },
        setItem: function(key, value) {
            store[key] = value.toString();
        },
        clear: function() {
            store = {};
        },
        removeItem: function(key) {
            delete store[key];
        }
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
