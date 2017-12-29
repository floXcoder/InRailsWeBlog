'use strict';

// // import TestUtils from 'react-addons-test-utils';
//
// import chai from 'chai';
// let {expect} = chai;
//
// import chaiEnzyme from 'chai-enzyme';
//
// import sinon from 'sinon';
// import sinonChai from 'sinon-chai';
//
// chai.use(sinonChai);
// chai.use(chaiEnzyme());
//
// // Factories
// var Factories = {};
// let requiredFactories = require.context('./factories', true, /\.jsx$/);
// requiredFactories.keys().forEach((key) => {
//     Factories[key.replace('./', '').replace('.jsx', '')] = requiredFactories(key);
// });
// var FactoryGenerator = {};
// FactoryGenerator.toJson = (factory, props = {}) => {
//     if (typeof Factories[factory] !== 'function') {
//         throw Error('Factory does not exist');
//     }
//
//     if (!props.id) {
//         props.id = 1;
//     }
//     let generator = Factories[factory](props);
//     let attributes = {};
//     let keys = Object.keys(generator);
//
//     if (props.refName && props.refId) {
//         attributes[`${props.refName}_id`] = props.refId;
//     }
//     for (let i = keys.length - 1, property, key; i >= 0; i--) {
//         key = keys[i];
//         property = generator[key];
//         if (property instanceof Object) {
//             if (property['belongsTo']) {
//                 let belongsToId = props.id;
//                 attributes[key] = FactoryGenerator.toJson(property['belongsTo'], {id: belongsToId});
//                 attributes[`${key}_id`] = belongsToId;
//             } else if (property['hasOne']) {
//                 let hasOneId = props.id;
//                 attributes[key] = FactoryGenerator.toJson(property['hasOne'], {
//                     id: hasOneId,
//                     refName: factory,
//                     refId: hasOneId
//                 });
//             } else if (property['hasMany']) {
//                 let hasManyAssociations = [];
//                 for (let i = 0; i < property['number']; i++) {
//                     hasManyAssociations.push(FactoryGenerator.toJson(property['hasMany'], {id: i + 1}));
//                 }
//                 attributes[key] = hasManyAssociations
//             } else {
//                 attributes[key] = property;
//             }
//         } else {
//             attributes[key] = property;
//         }
//     }
//
//     let propsKeys = Object.keys(props);
//     for (let i = propsKeys.length - 1, key; i >= 0; i--) {
//         key = propsKeys[i];
//         attributes[key] = props[key];
//     }
//
//     return attributes;
// };
//
// FactoryGenerator.create = (factory, props) => {
//     if (props && props.number) {
//         let generators = [];
//         for (let i = 0; i < props.number; i++) {
//             let newProps = _.merge(_.omit(props, 'number'), {id: i + 1});
//             generators.push(FactoryGenerator.toJson(factory, newProps));
//         }
//         return generators;
//     } else {
//         return FactoryGenerator.toJson(factory, props);
//     }
// };
//
// export {
//     expect,
//     sinon,
//     FactoryGenerator,
// }


// File called to set up environment before all tests

// Global variables from Webpack config
global.$ = global.jQuery = global.jquery = require('jquery');
global._ = require('lodash');
global.log = require('loglevel');
global.React = require('react');
global.ReactDOM = require('react-dom');
global.classNames = require('classnames');

window.railsEnv = 'test';
window.parameters = JSON.parse('{"website_name":"InRailsWeBlog","website_email":"blog@inrailsweblog.com","small_screen_up":601,"medium_screen_up":993,"large_screen_up":1201,"small_screen":600,"medium_screen":992,"large_screen":1200,"cache_time":7200,"image_size":8388608,"per_page":12,"user_pseudo_min_length":3,"user_pseudo_max_length":60,"user_email_min_length":5,"user_email_max_length":128,"user_password_min_length":8,"user_password_max_length":128,"topic_name_min_length":1,"topic_name_max_length":128,"topic_description_min_length":3,"topic_description_max_length":3000,"article_title_min_length":3,"article_title_max_length":128,"article_summary_min_length":3,"article_summary_max_length":256,"article_content_min_length":3,"article_content_max_length":8000000,"tag_name_min_length":1,"tag_name_max_length":52,"tag_description_min_length":3,"tag_description_max_length":3000,"comment_title_min_length":1,"comment_title_max_length":256,"comment_body_min_length":1,"comment_body_max_length":1024,"notation_min":0,"notation_max":5}');
window.userLatitude = '0.0';
window.userLongitutde = '0.0';
window.defaultLocale = 'fr';
window.locale = 'fr';

// jQuery
require('jquery-ujs');

// Materialize
require('materialize-css/dist/js/materialize');

// Expose global variables
require('../../app/assets/javascripts/modules/utils');

// Notifications
global.Notification = {
    alert: () => {
    },
    success: () => {
    },
    error: () => {
    }
};

// Keyboard inputs
global.Mousetrap = require('mousetrap');

// Translation
global.I18n = require('../../app/assets/javascripts/modules/i18n');
I18n.defaultLocale = window.defaultLocale;
I18n.locale = window.locale;

// Configure log level
log.setLevel('info');

// Make Enzyme functions available in all test files without importing
import { shallow, render, mount } from 'enzyme';
global.shallow = shallow;
global.render = render;
global.mount = mount;

import toJson from 'enzyme-to-json';
global.toJson = toJson;

// Fail tests on any warning
console.error = message => {
    throw new Error(message);
};

// Snapshot testing
import renderer from 'react-test-renderer';
global.renderer = renderer;

// Fake server
global.initSession = (data) => {
    $.getJSON = jest.genMockFunction().mockReturnValue({
        done: (callback) => {
            callback(data);

            return {
                fail: () => {
                }
            }
        }
    });
};

global.resetSession = () => {
    $.getJSON.mockReset();
};



