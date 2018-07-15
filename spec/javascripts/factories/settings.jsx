'use strict';

module.exports = (props = {}) => ({
    articlesLoader: 'infinite',
    articleDisplay: 'card',
    articleOrder: undefined,
    articleChildTagged: false,
    tagSidebarPin: true,
    tagSidebarWithChild: false,
    tagOrder: undefined,
    searchHighlight: true,
    searchOperator: 'or',
    searchExact: false
});
