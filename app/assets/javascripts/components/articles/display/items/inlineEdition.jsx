'use strict';

import {
    Link,
    Prompt
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';

import {
    inlineEditArticle,
    updateArticle,
    deleteArticle,
    spyTrackClick
} from '../../../../actions';

import ArticleInlineActions from '../../properties/inlineActions';

import {
    Editor
} from '../../../loaders/components';

import styles from '../../../../../jss/article/inline';

export default @connect(null, {
    inlineEditArticle,
    updateArticle,
    deleteArticle
})
@withStyles(styles)
class ArticleInlineEditionDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        currentTopicId: PropTypes.number.isRequired,
        // from connect
        inlineEditArticle: PropTypes.func,
        updateArticle: PropTypes.func,
        deleteArticle: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    state = {
        modifiedContent: undefined
    };

    _handleTitleClick = () => {
        spyTrackClick('article', this.props.article.id, this.props.article.slug, this.props.article.title);
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
        this.props.updateArticle({
            id: this.props.article.id,
            content: this.state.modifiedContent
        })
            .then(() => this.props.inlineEditArticle(null));
    };

    render() {
        return (
            <div id={`article-${this.props.article.id}`}
                 className={this.props.classes.root}>
                <Prompt when={!!this.state.modifiedContent}
                        message={location => I18n.t('js.article.form.unsaved', {location: location.pathname})}/>

                {
                    this.props.article.title &&
                    <Link to={`/users/${this.props.article.user.slug}/articles/${this.props.article.slug}`}
                          onClick={this._handleTitleClick}>
                        <h1 className={this.props.classes.title}>
                            {this.props.article.title}
                        </h1>
                    </Link>
                }

                <div className={this.props.classes.inlineEditor}>
                    <Editor modelName="article"
                            modelId={this.props.article.id}
                            currentTopicId={this.props.currentTopicId}
                            mode={2}
                            onChange={this._handleEditorChange}
                            onSubmit={this._handleSaveClick}
                            onEditorLoaded={this._handleEditorLoaded}>
                        {this.props.article.content}
                    </Editor>
                </div>

                <div className={this.props.classes.actions}>
                    <ArticleInlineActions classes={this.props.classes}
                                          onSaveClick={this._handleSaveClick}
                                          onCancelClick={this._handleCancelClick}
                                          onDeleteClick={this._handleDeleteClick}/>
                </div>
            </div>
        );
    }
}
