import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import {
    Link,
    // Prompt
} from 'react-router';

import {
    userArticlePath
} from '@js/constants/routesHelper';

import {
    inlineEditArticle,
    updateArticle,
    deleteArticle
} from '@js/actions/articleActions';

import {
    spyTrackClick
} from '@js/actions/metricsActions';

import ArticleInlineActions from '@js/components/articles/properties/inlineActions';

import {
    Editor
} from '@js/components/loaders/components';


class ArticleInlineEditionDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        currentUserId: PropTypes.number.isRequired,
        currentTopicId: PropTypes.number.isRequired,
        // from connect
        inlineEditArticle: PropTypes.func,
        updateArticle: PropTypes.func,
        deleteArticle: PropTypes.func
    };

    constructor(props) {
        super(props);

        // this._isSaving = false;
    }

    state = {
        modifiedContent: undefined
    };

    _handleTitleClick = () => {
        spyTrackClick('article', this.props.article.id, this.props.article.slug, this.props.article.userId, this.props.article.title, this.props.article.topicId);
    };

    _handleDeleteClick = () => {
        this.props.deleteArticle(this.props.article.id);
    };

    _handleCancelClick = () => {
        this.props.inlineEditArticle(null);
    };

    _handleEditorChange = (content) => {
        this.setState({
            modifiedContent: content
        });
    };

    _handleSaveClick = () => {
        // this._isSaving = true;

        this.props.updateArticle({
            id: this.props.article.id,
            content: this.state.modifiedContent
        })
            .then(() => this.props.inlineEditArticle(null));
    };

    render() {
        return (
            <div id={`article-${this.props.article.id}`}
                 className="article-inline-root">
                {/*<Prompt when={!!this.state.modifiedContent && !this._isSaving}*/}
                {/*        message={(location) => I18n.t('js.article.form.unsaved', {location: location.pathname})}/>*/}

                {
                    !!this.props.article.title &&
                    <Link to={userArticlePath(this.props.article.user.slug, this.props.article.slug)}
                          onClick={this._handleTitleClick}>
                        <h1 className="article-inline-title">
                            {this.props.article.title}
                        </h1>
                    </Link>
                }

                <div className="article-inline-inline-editor">
                    <Editor modelName="article"
                            modelId={this.props.article.id}
                            currentUserId={this.props.currentUserId}
                            currentTopicId={this.props.currentTopicId}
                            mode={2}
                            onChange={this._handleEditorChange}
                            onSubmit={this._handleSaveClick}
                            onEditorLoaded={this._handleEditorLoaded}>
                        {this.props.article.content}
                    </Editor>
                </div>

                <div className="article-inline-actions">
                    <ArticleInlineActions onSaveClick={this._handleSaveClick}
                                          onCancelClick={this._handleCancelClick}
                                          onDeleteClick={this._handleDeleteClick}/>
                </div>
            </div>
        );
    }
}

export default connect(null, {
    inlineEditArticle,
    updateArticle,
    deleteArticle
})(ArticleInlineEditionDisplay)