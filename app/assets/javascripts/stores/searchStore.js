'use strict';

// TODO
// export default class SearchStore extends mix(Reflux.Store).with(Errors) {
//     constructor() {
//         super();
//
//         this.listenables = SearchActions;
//         this.url = '/search';
//     }
//
//     onSearch(data, filter) {
//         if ($.isEmpty(data)) {
//             log.error('Tried to search without data');
//             return;
//         }
//
//         const url = this.url;
//
//         let requestParam = {
//             search: data
//         };
//
//         if (filter) {
//             requestParam.search = _.merge(requestParam.search, filter);
//         }
//
//         $.getJSON(url, requestParam)
//             .done((dataReceived) => {
//                 if (!$.isEmpty(dataReceived)) {
//                     this.trigger({
//                         type: 'search',
//                         results: dataReceived
//                     });
//
//                     if (window._paq) {
//                         let totalResults = 0;
//                         for (const resultType in dataReceived.total_count) {
//                             totalResults += dataReceived.total_count[resultType];
//                         }
//
//                         window._paq.push(['trackSiteSearch', dataReceived.query, 'Search', totalResults]);
//                     }
//                 } else {
//                     log.error('No data received from search');
//                 }
//             })
//             .fail((xhr, status, error) => {
//                 this.handleErrors(url, xhr, status, error);
//             });
//     }
//
//     onAutocomplete(type, value, data, callback) {
//         if ($.isEmpty(type) || $.isEmpty(value)) {
//             log.error('Tried to autocomplete without type or value');
//             return;
//         }
//
//         const url = this.url + '/' + 'autocomplete';
//
//         let requestParam = {
//             search: _.merge(data, {
//                 type: type,
//                 query: value
//             })
//         };
//
//         $.getJSON(
//             url,
//             requestParam)
//             .done((dataReceived) => {
//                 if (!$.isEmpty(callback)) {
//                     if (type === 'article') {
//                         callback(dataReceived.articles);
//                     } else if (type === 'tag') {
//                         callback(dataReceived.tags);
//                     } else if (type === 'topic') {
//                         callback(dataReceived.topics);
//                     } else {
//                         callback(dataReceived);
//                     }
//                 } else {
//                     this.trigger({
//                         type: 'autocomplete',
//                         autocompleteResults: dataReceived
//                     });
//                 }
//             })
//             .fail((xhr, status, error) => {
//                 this.handleErrors(url, xhr, status, error);
//             });
//     }
// }
