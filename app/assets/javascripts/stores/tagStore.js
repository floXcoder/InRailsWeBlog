'use strict';

// TODO
// export default class TagStore extends mix(Reflux.Store).with(Errors, Tracker) {
//     constructor() {
//         super();
//
//         this.listenables = TagActions;
//         this.url = '/tags';
//         this.userTags = [];
//
//         // TODO
//         // this.onLoadTags({init: true, userTags: true});
//     }
//
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
//         let requestParam = {};
//
//         if (params) {
//             requestParam.tags = {};
//
//             if (params.userTags) {
//                 requestParam.user_tags = params.userTags;
//             }
//
//             if (params.userId) {
//                 requestParam.tags.user_id = params.userId;
//             }
//
//             if (params.topicId) {
//                 requestParam.tags.topic_id = params.topicId;
//             }
//         }
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
//         // TODO: use redux global state instead of $app
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
//
//     onUpdateTag(tag) {
//         if ($.isEmpty(tag) || $.isEmpty(tag.id)) {
//             log.error('Tried to update tag without data');
//             return;
//         }
//
//         const url = this.url + '/' + tag.id;
//
//         let requestParam = {
//             _method: 'put',
//             tags: tag
//         };
//
//         $.ajax({
//             url: url,
//             dataType: 'json',
//             type: 'POST',
//             data: requestParam
//         })
//             .done((dataReceived) => {
//                 if (!$.isEmpty(dataReceived)) {
//                     this.trigger({
//                         type: 'updateTag',
//                         tag: dataReceived.tag
//                     });
//                 } else {
//                     log.error('No data received from update tag');
//                 }
//             })
//             .fail((xhr, status, error) => {
//                 if (xhr && xhr.status === 403) {
//                     this.trigger({
//                         type: 'updateTagError',
//                         tagErrors: xhr.responseJSON
//                     });
//                 } else {
//                     this.handleErrors(url, xhr, status, error);
//                 }
//             });
//     }
//
//     onDeleteTag(tag) {
//         if ($.isEmpty(tag)) {
//             log.error('Tried to delete tag without tag');
//             return;
//         }
//
//         let url = this.url;
//
//         let requestParam = {};
//         let showMode = false;
//
//         if (tag.id) {
//             url += '/' + tag.id;
//             requestParam._method = 'delete';
//         }
//
//         $.ajax({
//             url: url,
//             dataType: 'json',
//             type: 'POST',
//             data: requestParam
//         })
//             .done((dataReceived) => {
//                 if (!$.isEmpty(dataReceived)) {
//                     this.trigger({
//                         type: 'deleteTag',
//                         deletedTag: dataReceived
//                     });
//                 } else {
//                     log.error('No data received from delete tag');
//                 }
//             })
//             .fail((xhr, status, error) => {
//                 this.handleErrors(url, xhr, status, error);
//             });
//     }
// }
