'use strict';

// TODO
// export default class TagStore extends mix(Reflux.Store).with(Errors, Tracker) {
//     getInitialState() {
//         return {
//             type: 'userTags',
//             userTags: this.userTags
//         };
//     }
//
//     onLoadTags(params) {
//         const url = this.url;
//
//         $.getJSON(this.url, requestParam)
//             .done((dataReceived) => {
//                 if (!$.isEmpty(dataReceived)) {
//                     if (params && params.init) {
//                         this.userTags = dataReceived.tags;
//                         this.trigger({
//                             type: 'userTags',
//                             userTags: dataReceived.tags
//                         });
//                     } else {
//                         this.trigger({
//                             type: 'loadTags',
//                             tags: dataReceived.tags
//                         });
//                     }
//                 }
//             })
//             .fail((xhr, status, error) => {
//                 this.handleErrors(url, xhr, status, error);
//             });
//     }
//
//     onRefreshTags() {
//         if ($app.user.tags) {
//             this.trigger({
//                 type: 'refreshTags',
//                 tags: $app.user.tags
//             });
//         }
//     }
//
//     onLoadTag(data) {
//         if ($.isEmpty(data) && !data.id) {
//             log.error('Tried to load tag without data');
//             return;
//         }
//
//         const url = this.url + '/' + data.id;
//
//         let requestParam = {};
//
//         $.getJSON(url, requestParam)
//             .done((dataReceived) => {
//                 if (!$.isEmpty(dataReceived)) {
//                     this.trigger({
//                         type: 'loadTag',
//                         tag: dataReceived.tag
//                     });
//                 } else {
//                     log.error('No data received from fetch tag');
//                 }
//             })
//             .fail((xhr, status, error) => {
//                 this.handleErrors(url, xhr, status, error);
//             });
//     }
// }
