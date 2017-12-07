'use strict';

import {
    connect
} from 'react-redux';

import {
    getArticleUserId,
    getArticleTitle,
    getArticleContent,
    getArticleTags
} from '../../../selectors/articleSelectors';

// TODO
// import ArticleActions from '../../../actions/articleActions';

import ArticleEditionIcons from '../icons/edition';
import ArticleLinkIcon from '../icons/link';

import Editor from '../../editor/editor';

@connect((state, props) => ({
    articleUserId: getArticleUserId(state.articleState, props.articleId),
    title: getArticleTitle(state.articleState, props.articleId),
    content: getArticleContent(state.articleState, props.articleId),
    tags: getArticleTags(state.articleState, props.articleId),
}))
export default class ArticleEditionDisplay extends React.Component {
    static propTypes = {
        articleId: PropTypes.number.isRequired,

        articleUserId: PropTypes.number,
        title: PropTypes.string,
        content: PropTypes.string,
        tags: PropTypes.array,

        onTagClick: PropTypes.func.isRequired,
        setDefaultDisplay: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);

        this._editor = null;
    }

    // TODO: user article global state to store this state
    state = {
        isLink: false
    };

    // TODO
    // _handleEditorChange (event) {
    //     let text = event.currentTarget.textContent;
    //
    //     if ($.isURL(text.trim()) && !this.state.isLink) {
    //         this.setState({isLink: true});
    //         this._editor.reset();
    //         this.state.editor.summernote("createLink", {
    //             text: text.trim(),
    //             url: text.trim(),
    //             isNewWindow: true
    //         });
    //     } else if (this.state.isLink && !$.isURL(text.trim())) {
    //         this.state.isLink = false;
    //         this.setState({isLink: false});
    //     }
    // }

    _handleTagClick = (tagName, event) => {
        this.props.onTagClick(tagName, event);
    };

    _handleDeleteClick = (event) => {
        this._editor.remove();
        // TODO
        // ArticleActions.deleteArticle({id: this.props.article.id});
        this.props.setDefaultDisplay();
    };

    _handleCancelClick = (event) => {
        this._editor.remove();
        this.props.setDefaultDisplay();
    };

    _handleSaveClick = (event) => {
        let content = this._editor.serialize();
        // TODO
        // ArticleActions.updateArticle({id: this.props.article.id, content: content});
        this._editor.remove();
        this.props.setDefaultDisplay();
    };

    render() {
        return (
            <div className="card blog-article-item article-edition clearfix">
                <div className="card-content">
                    <div className="card-title article-title center clearfix">
                        <h1 className="article-title-card">
                            {this.props.title}
                        </h1>
                    </div>

                    <Editor ref={(editor) => this._editor = editor}
                            mode={Editor.mode.INLINE_EDIT}
                            id={'editor-summernote-' + this.props.articleId}
                            onEditorLoaded={this._handleEditorLoaded}>
                        {this.props.content}
                    </Editor>

                </div>
                <div className="card-action clearfix">
                    {
                        this.props.tags.map((tag) => (
                            <a key={tag.id}
                               onClick={this._handleTagClick.bind(this, tag.id)}
                               className="btn-small waves-effect waves-light">
                                {tag.name}
                            </a>
                        ))
                    }
                    <div className="right">
                        <ArticleEditionIcons articleUserId={this.props.articleUserId}
                                             onDeleteClick={this._handleDeleteClick}
                                             onCancelClick={this._handleCancelClick}
                                             onSaveClick={this._handleSaveClick}/>
                        <ArticleLinkIcon isLink={this.state.isLink}/>
                    </div>
                </div>
            </div>
        );
    }
}
