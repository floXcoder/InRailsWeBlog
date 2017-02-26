'use strict';

const ArticleStore = require('../../../stores/articleStore');

const FixedActionButton = require('../../materialize/fab');

const ArticleEditIcon = require('../icons/edit');
const ArticleLinkIcon = require('../icons/link');
const ArticleVisibilityIcon = require('../icons/visibility');
const ArticleBookmarkIcon = require('../icons/bookmark');
const ArticleLink = require('../properties/link');

const ArticleActions = ({article, onBookmarkClick, onEditClick, onVisibilityClick}) => (
    <FixedActionButton>
        <ArticleBookmarkIcon article={article}
                             onBookmarkClick={onBookmarkClick}/>

        <ArticleVisibilityIcon article={article}
                               hasFloatingButton={true}
                               onVisibilityClick={onVisibilityClick}/>

        <ArticleEditIcon article={article}
                         onEditClick={onEditClick}/>

        <ArticleLink article={article}
                     onArticleClick={(article, event) => {this._handleArticleClick.bind(article, event)}}/>
    </FixedActionButton>
);

ArticleActions.propTypes = {
    article: React.PropTypes.object.isRequired,
    onBookmarkClick: React.PropTypes.func.isRequired,
    onEditClick: React.PropTypes.func,
    onVisibilityClick: React.PropTypes.func
};

ArticleActions.defaultProps = {
    onEditClick: null,
    onVisibilityClick: null
};

ArticleActions._handleArticleClick = (article, event) => {
    ArticleStore.onTrackClick(article.id);
    return event;
};

module.exports = ArticleActions;
