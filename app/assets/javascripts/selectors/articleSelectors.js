'use strict';

import {
    createSelector
} from 'reselect';

export const getArticlesIds = (stateArticles) => stateArticles.result || [];

export const getArticlesCount = (stateArticles) => stateArticles.result.length || 0;

export const getArticleSlug = (stateArticles, id) => stateArticles.articles[id].slug;

export const getArticleTitle = (stateArticles, id) => stateArticles.articles[id].title;

export const getArticleContent = (stateArticles, id) => {
    // TODO
    // return isHighlightingResults && !$.isEmpty(article.highlight_content) ?
    //     article.highlight_content :
    //     article.content

    return stateArticles.articles[id].content;
};

export const getArticleUpdatedAt = (stateArticles, id) => stateArticles.articles[id].updatedAt;

export const getArticleCommentsNumber = (stateArticles, id) => stateArticles.articles[id].commentsNumber;

export const getArticleIsOutdated = (stateArticles, id) => stateArticles.articles[id].outdatedNumber > 3;

export const getArticleUser = (stateArticles, id) => stateArticles.users[stateArticles.articles[id].user];
export const getArticleUserId = (stateArticles, id) => stateArticles.articles[id].user;

export const getArticleTags = (stateArticles, id) => stateArticles.articles[id].tags.map(id => stateArticles.tags[id]);

export const getArticleParentTags = (stateArticles, id) => stateArticles.articles[id].parentTags.map(id => stateArticles.parentTags[id]);
export const getArticleParentTagIds = (stateArticles, id) => stateArticles.articles[id].parentTags;

export const getArticleChildTags = (stateArticles, id) => stateArticles.articles[id].childTags.map(id => stateArticles.childTags[id]);
export const getArticleChildTagIds = (stateArticles, id) => stateArticles.articles[id].childTags;


// export const getArticles = (stateArticles) => denormalize(stateArticles.result, [articleSchema], stateArticles.entities);

// const getItemsIds = state => state.get('ids');
// const getItemsById = state => state.get('byId');
// const getItems = createSelector(
//     [getItemsIds, getItemsById],
//     (itemsIds, itemsById) => itemsIds.map(id => itemsById.get(id)),
// );

// This is proper if it is needed in multiple instances
// export const makeGetBarState = () => createSelector(
//     [ getBar ],
//     (bar) => bar
// )
// const makeMapStateToProps = () => {
//     const getBarState = makeGetBarState()
//     const mapStateToProps = (state, props) => {
//         return {
//             bar: getBarState(state, props)
//         }
//     }
//     return mapStateToProps
// }
// export default connect(makeMapStateToProps)(ReactComp)
