'use strict';

import {
    Suspense
} from 'react';

import {
    ArticleInlineEditionDisplay
} from '../../loaders/components';

import {
    inlineEditArticle
} from '../../../actions';

import {
    getArticleIsOwner
} from '../../../selectors';

import ArticleCardDisplay from './card';
import ArticleInlineDisplay from './inline';
import ArticleGridDisplay from './grid';

export default @connect((state, props) => ({
    currentUserSlug: state.userState.currentSlug,
    currentUserTopicId: state.topicState.currentUserTopicId,
    currentUserTopicSlug: state.topicState.currentUserTopicSlug,
    isOwner: getArticleIsOwner(state, props.article)
}), {
    inlineEditArticle
})
class ArticleItemDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        articleDisplayMode: PropTypes.string.isRequired,
        articleEditionId: PropTypes.number,
        hasCardActions: PropTypes.bool,
        isMinimized: PropTypes.bool,
        onEnter: PropTypes.func,
        onExit: PropTypes.func,
        // from connect
        currentUserSlug: PropTypes.string,
        currentUserTopicId: PropTypes.number,
        currentUserTopicSlug: PropTypes.string,
        isOwner: PropTypes.bool,
        inlineEditArticle: PropTypes.func,
        onClick: PropTypes.func
    };

    static defaultProps = {
        hasCardActions: true,
        isMinimized: false
    };

    constructor(props) {
        super(props);
    }

    _handleInlineEditClick = (event) => {
        if (event) {
            event.preventDefault();
        }

        this.props.inlineEditArticle(this.props.article.id);
    };

    render() {
        if (this.props.articleDisplayMode === 'edit' || this.props.articleEditionId === this.props.article.id) {
            return (
                <Suspense fallback={<div/>}>
                    <ArticleInlineEditionDisplay article={this.props.article}
                                                 currentUserTopicId={this.props.currentUserTopicId}
                                                 isOwner={this.props.isOwner}/>
                </Suspense>
            );
        } else if (this.props.articleDisplayMode === 'inline') {
            return (
                <ArticleInlineDisplay id={this.props.article.id}
                                      title={this.props.article.title}
                                      content={this.props.article.content}
                                      slug={this.props.article.slug}
                                      userSlug={this.props.article.user.slug}
                                      isMinimized={this.props.isMinimized}
                                      isOwner={this.props.isOwner}
                                      onEnter={this.props.onEnter}
                                      onExit={this.props.onExit}
                                      onInlineEdit={this._handleInlineEditClick}/>
            );
        } else if (this.props.articleDisplayMode === 'card') {
            return (
                <ArticleCardDisplay article={this.props.article}
                                    currentUserSlug={this.props.currentUserSlug}
                                    currentUserTopicSlug={this.props.currentUserTopicSlug}
                                    isOwner={this.props.isOwner}
                                    hasActions={this.props.hasCardActions}
                                    isMinimized={this.props.isMinimized}
                                    onInlineEdit={this._handleInlineEditClick}
                                    onEnter={this.props.onEnter}
                                    onExit={this.props.onExit}
                                    onClick={this.props.onClick}/>
            );
        } else if (this.props.articleDisplayMode === 'grid') {
            return (
                <ArticleGridDisplay article={this.props.article}
                                    currentUserSlug={this.props.currentUserSlug}
                                    currentUserTopicSlug={this.props.currentUserTopicSlug}
                                    isOwner={this.props.isOwner}
                                    isMinimized={this.props.isMinimized}
                                    onEnter={this.props.onEnter}
                                    onExit={this.props.onExit}
                                    onClick={this.props.onClick}/>
            );
        } else {
            throw new Error('Article display mode unknown or empty: ' + this.props.articleDisplayMode);
        }
    }
}
