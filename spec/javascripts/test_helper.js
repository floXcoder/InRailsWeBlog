'use strict';

// File called to set up environment before all tests

// Global variables from Webpack config
global.$ = global.jQuery = global.jquery = require('jquery');
global.log = require('loglevel');
global.React = require('react');
global.ReactDOM = require('react-dom');
global.PropTypes = require('prop-types');
global.connect = require('react-redux').connect;
global.classNames = require('classnames');

// Polyfill promise
require('es6-promise').polyfill();

// jQuery Rails (require is required to find jQuery)
require('jquery-ujs');

// Materialize
import '../../app/assets/javascripts/common/materialize';

// Expose global variables
import * as utils from '../../app/assets/javascripts/modules/utils';

global.Utils = utils;

// Translation
global.I18n = require('../../app/assets/javascripts/modules/i18n');
require('./translations/en');
require('./translations/fr');
I18n.defaultLocale = 'fr';
I18n.locale = 'fr';

// Configure log level
log.setLevel('info');

// Fail tests on any warnings
console.error = message => {
    throw new Error(message);
};

window.onerror = function (message, url, lineNumber, columnNumber, trace) {
    log.error(trace);
};

// Make Enzyme functions available in all test files without importing
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({adapter: new Adapter()});

global.shallow = Enzyme.shallow;
global.render = Enzyme.render;
global.mount = Enzyme.mount;

// Snapshot testing
import renderer from 'react-test-renderer';

global.renderer = renderer;

global.fetchMock = require('fetch-mock');
global.mock = (url, status, callback) => {
    fetchMock.mock(url, (url, request) => ({
        status: status,
        body: typeof callback === 'function' ? callback(request.body && JSON.parse(request.body), url) : null
    }));
};

global.FactoryGenerator = require('./factory').default;

import {
    createStore,
    applyMiddleware
} from 'redux';

import thunk from 'redux-thunk';

import fetchMiddleware from '../../app/assets/javascripts/middlewares/fetch';
import mutationMiddleware from '../../app/assets/javascripts/middlewares/mutation';

global.buildStore = applyMiddleware(fetchMiddleware, mutationMiddleware, thunk)(createStore);

global.dispatch = (store, actionCreator) => {
    const dispatch = store.dispatch(actionCreator);
    const isPromise = (typeof dispatch.then === 'function');

    if (isPromise) {
        return dispatch.then(() => store.getState());
    } else {
        return store.getState();
    }
};

// Notifications
global.Notification = {
    alert: jest.fn(),
    success: jest.fn(),
    error: jest.fn()
};

// Environment configuration
window.railsEnv = 'test';
window.settings = JSON.parse('{"website_name":"InRailsWeBlog","website_email":"blog@inrailsweblog.com","cache_time":7200,"user_pseudo_min_length":3,"user_pseudo_max_length":60,"user_email_min_length":5,"user_email_max_length":128,"user_password_min_length":8,"user_password_max_length":128,"topic_name_min_length":1,"topic_name_max_length":128,"topic_description_min_length":3,"topic_description_max_length":3000,"article_title_min_length":3,"article_title_max_length":128,"article_summary_min_length":3,"article_summary_max_length":256,"article_content_min_length":3,"article_content_max_length":8000000,"tag_name_min_length":1,"tag_name_max_length":52,"tag_description_min_length":3,"tag_description_max_length":3000,"comment_title_min_length":1,"comment_title_max_length":256,"comment_body_min_length":1,"comment_body_max_length":1024,"notation_min":0,"notation_max":5,"per_page":20,"search_per_page":30,"image_size":8388608,"topic_color":"#e5e5e5","tag_color":"#e5e5e5","small_screen":600,"small_screen_up":601,"medium_screen":992,"medium_screen_up":993,"large_screen":1200,"large_screen_up":1201}');

window.userLatitude = '0.0';
window.userLongitutde = '0.0';
