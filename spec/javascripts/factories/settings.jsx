'use strict';

module.exports = (props = {}) => ({
    articlesLoader: 'infinite',
    articleDisplay: 'card',
    articleOrder: undefined,
    tagParentAndChild: false,
    tagSidebarPin: true,
    tagSidebarWithChild: false,
    tagOrder: undefined,
    searchHighlight: true,
    searchOperator: 'or',
    searchExact: false
});
