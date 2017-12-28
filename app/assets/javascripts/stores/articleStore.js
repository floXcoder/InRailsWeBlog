'use strict';

// TODO
// export default class ArticleStore extends mix(Reflux.Store).with(Errors, Tracker) {
//     constructor() {
//         super();
//
//         this.listenables = ArticleActions;
//         this.url = '/articles';
//     }
//
//     _fetchArticles(data, callback) {
//         let url = this.url;
//
//         let requestParam = {};
//
//         if (data) {
//             requestParam = {
//                 filter: {}
//             };
//
//             // TODO: move in search action
//             // if (data.query) {
//             //     requestParam.query = data.query;
//             //     url += '/search';
//             //
//             //     if (data.searchOptions) {
//             //         requestParam.search_options = data.searchOptions;
//             //     }
//             // }
//             //
//             // if (data.autocompleteQuery) {
//             //     requestParam.autocompleteQuery = data.autocompleteQuery;
//             //     url += '/autocomplete';
//             // }
//         }
//
//         $.getJSON(
//             url,
//             requestParam)
//             .done((dataReceived) => {
//                 if (!$.isEmpty(dataReceived)) {
//                     callback.bind(this, dataReceived)();
//                 } else {
//                     log.error('No data received from fetch articles');
//                 }
//             })
//             .fail((xhr, status, error) => {
//                 this.handleErrors(url, xhr, status, error);
//             });
//     }
//
//     onLoadArticles(data) {
//         this._fetchArticles(data, (dataReceived) => {
//             if (!$.isEmpty(dataReceived)) {
//                 this.trigger({
//                     type: 'loadArticles',
//                     articles: dataReceived.articles,
//                     pagination: dataReceived.meta
//                 });
//             }
//         });
//     }
//
//     onLoadArticle(data) {
//         if ($.isEmpty(data) && (!data.id || !data.slug)) {
//             log.error('Tried to load article without data');
//             return;
//         }
//
//         let requestParam = {};
//
//         let url = this.url + '/';
//         if (data.id) {
//             url += data.id;
//         } else if (data.slug) {
//             url += data.slug;
//         }
//
//         $.getJSON(url, requestParam)
//             .done((dataReceived) => {
//                 if (!$.isEmpty(dataReceived)) {
//                     this.trigger({
//                         type: 'loadArticle',
//                         article: dataReceived.article
//                     });
//                 } else {
//                     log.error('No data received from fetch articles');
//                 }
//             })
//             .fail((xhr, status, error) => {
//                 this.handleErrors(url, xhr, status, error);
//             });
//     }
//
//     onAutosaveArticle(data) {
//         if ($.isEmpty(data)) {
//             log.error('Tried to autosave article without data');
//             return;
//         }
//
//         let requestParam = {
//             articles: data
//         };
//
//         $.ajax({
//             url: this.url,
//             async: false,
//             dataType: 'json',
//             type: 'POST',
//             data: requestParam,
//             success: (data) => {
//                 return true
//             },
//             error: (xhr, status, error) => {
//                 return false
//             }
//         });
//     }
//
//     onLoadArticleHistory(data) {
//         if ($.isEmpty(data.history)) {
//             log.error('Tried to load article history without data');
//             return;
//         }
//
//         const url = this.url + '/' + data.history + '/history';
//
//         const requestParam = {};
//
//         $.getJSON(url, requestParam)
//             .done((dataReceived) => {
//                 this.trigger({
//                     type: 'loadArticleHistory',
//                     articleVersions: dataReceived['paper_trail/versions'] || []
//                 });
//             })
//             .fail((xhr, status, error) => {
//                 this.handleErrors(url, xhr, status, error);
//             });
//     }
//
//     onRestoreArticle(data) {
//         if ($.isEmpty(data.restore)) {
//             log.error('Tried to restore article without data');
//             return;
//         }
//
//         const url = this.url + '/' + data.restore.articleId + '/restore';
//
//         const requestParam = {
//             version_id: data.restore.versionId
//         };
//
//         $.getJSON(url, requestParam)
//             .done((dataReceived) => {
//                 this.trigger({
//                     type: 'restoreArticle',
//                     articleRestored: dataReceived.article
//                 });
//             })
//             .fail((xhr, status, error) => {
//                 this.handleErrors(url, xhr, status, error);
//             });
//     }
//
//     onBookmarkArticle(data) {
//         if ($.isEmpty(data.articleId)) {
//             log.error('Tried to bookmark an article article id');
//             return;
//         }
//
//         const url = this.url + '/' + data.articleId + '/bookmark';
//
//         let requestParam = {
//             article_id: data.articleId
//         };
//
//         if (data.isBookmarked) {
//             requestParam._method = 'delete';
//         }
//
//         $.ajax({
//             url: url,
//             dataType: 'json',
//             type: 'POST',
//             data: requestParam,
//             success: (dataReceived) => {
//                 if (data.isBookmarked) {
//                     Notification.success(I18n.t('js.article.bookmark.removed'));
//                 } else {
//                     Notification.success(I18n.t('js.article.bookmark.added'));
//                 }
//                 return true;
//             },
//             error: (xhr, status, error) => {
//                 this.handleErrors(url, xhr, status, error);
//             }
//         });
//     }
//
//     onVoteArticle(data) {
//         if ($.isEmpty(data.articleId)) {
//             log.error('Tried to vote for an article without article id');
//             return;
//         }
//
//         let url = this.url + '/' + data.articleId;
//
//         let requestParam = {
//             article_id: data.articleId
//         };
//
//         if (data.isUp) {
//             url += '/vote_up';
//         } else {
//             url += '/vote_down';
//         }
//
//         $.ajax({
//             url: url,
//             dataType: 'json',
//             type: 'POST',
//             data: requestParam,
//             success: (dataReceived) => {
//                 Notification.success(I18n.t('js.article.vote.added'));
//                 return true;
//             },
//             error: (xhr, status, error) => {
//                 this.handleErrors(url, xhr, status, error);
//             }
//         });
//     }
//
//     onOutdateArticle(data) {
//         if ($.isEmpty(data.articleId)) {
//             log.error('Tried to outdate an article without article id');
//             return;
//         }
//
//         const url = this.url + '/' + data.articleId + '/outdate';
//
//         let requestParam = {
//             article_id: data.articleId
//         };
//
//         if (data.isOutdated) {
//             requestParam._method = 'delete';
//         }
//
//         $.ajax({
//             url: url,
//             dataType: 'json',
//             type: 'POST',
//             data: requestParam,
//             success: (dataReceived) => {
//                 if (data.isOutdated) {
//                     Notification.success(I18n.t('js.article.outdated.removed'));
//                 } else {
//                     Notification.success(I18n.t('js.article.outdated.added'));
//                 }
//                 return true;
//             },
//             error: (xhr, status, error) => {
//                 this.handleErrors(url, xhr, status, error);
//             }
//         });
//     }
// }
