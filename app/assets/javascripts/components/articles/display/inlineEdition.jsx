'use strict';

import {
    getArticleIsOwner
} from '../../../selectors';

import ArticleEditionIcons from '../icons/edition';
import ArticleLinkIcon from '../icons/link';

import Editor from '../../editor/editor';

// TODO: use redux to change article display mode but only for current article
@connect((state) => ({
    isOwner: getArticleIsOwner(state)
}), {})
export default class ArticleEditionDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        // From connect
        isOwner: PropTypes.bool,

        // TODO
        // onTagClick: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        this._editor = null;
    }

    // TODO: user article global state to store this state
    state = {
        isLink: false
    };

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
        // this.props.onTagClick(tagName, event);
    };

    _handleDeleteClick = (event) => {
        // useless
        // this._editor.remove();

        // ArticleActions.deleteArticle({id: this.props.article.id});
        // this.props.changeDefaultDisplay();
    };

    _handleCancelClick = (event) => {
        this._editor.remove();
        // this.props.changeDefaultDisplay();
    };

    _handleSaveClick = (event) => {
        let content = this._editor.serialize();
        // ArticleActions.updateArticle({id: this.props.article.id, content: content});
        this._editor.remove();
        // this.props.changeDefaultDisplay();
    };

    render() {
        return (
            <div className="card blog-article-item article-edition clearfix">
                <div className="card-content">
                    <div className="card-title article-title center clearfix">
                        <h1 className="article-title-card">
                            {this.props.article.title}
                        </h1>
                    </div>

                    <Editor ref={(editor) => this._editor = editor}
                            mode={Editor.mode.INLINE_EDIT}
                            id={'editor-summernote-' + this.props.article.id}
                            onEditorLoaded={this._handleEditorLoaded}>
                        {this.props.article.content}
                    </Editor>

                </div>
                <div className="card-action clearfix">
                    {
                        this.props.article.tags.map((tag) => (
                            <a key={tag.id}
                               onClick={this._handleTagClick.bind(this, tag.id)}
                               className="btn-small waves-effect waves-light">
                                {tag.name}
                            </a>
                        ))
                    }
                    <div className="right">
                        <ArticleEditionIcons onDeleteClick={this._handleDeleteClick}
                                             onCancelClick={this._handleCancelClick}
                                             onSaveClick={this._handleSaveClick}
                                             isOwner={this.props.isOwner}/>
                        <ArticleLinkIcon isLink={this.state.isLink}/>
                    </div>
                </div>
            </div>
        );
    }
}
