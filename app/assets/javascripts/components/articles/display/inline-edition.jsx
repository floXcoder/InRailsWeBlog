'use strict';

import ArticleActions from '../../../actions/articleActions';
import ArticleEditionIcons from '../icons/edition';
import ArticleLinkIcon from '../icons/link';

import Editor from '../../editor/editor';

export default class ArticleEditionDisplay extends React.Component {
    static propTypes = {
        children: React.PropTypes.string.isRequired,
        article: React.PropTypes.object.isRequired,
        onTagClick: React.PropTypes.func.isRequired,
        setDefaultDisplay: React.PropTypes.func.isRequired
    };

    state = {
        isLink: false
    };

    constructor(props) {
        super(props);
    }

    // _handleEditorChange (event) {
    //     let text = event.currentTarget.textContent;
    //
    //     if ($.isURL(text.trim()) && !this.state.isLink) {
    //         this.setState({isLink: true});
    //         this.refs.editor.reset();
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

    _handleTagClick= (tagName, event) => {
        this.props.onTagClick(tagName, event);
    };

    _handleDeleteClick = (event) => {
        this.refs.editor.remove();
        ArticleActions.deleteArticle({id: this.props.article.id});
        this.props.setDefaultDisplay();
    };

    _handleCancelClick = (event) => {
        this.refs.editor.remove();
        this.props.setDefaultDisplay();
    };

    _handleSaveClick = (event) => {
        let content = this.refs.editor.serialize();
        ArticleActions.updateArticle({id: this.props.article.id, content: content});
        this.refs.editor.remove();
        this.props.setDefaultDisplay();
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

                    <Editor ref="editor"
                            mode={Editor.mode.INLINE_EDIT}
                            id={'editor-summernote-' + this.props.article.id}
                            onEditorLoaded={this._handleEditorLoaded}>
                        {this.props.children}
                    </Editor>

                </div>
                <div className="card-action clearfix">
                    {
                        this.props.article.tags.map((tag) =>
                            <a key={tag.id}
                               onClick={this._handleTagClick.bind(this, tag.id)}
                               className="waves-effect waves-light btn-small grey lighten-5 black-text">
                                {tag.name}
                            </a>
                        )
                    }
                    <div className="right">
                        <ArticleEditionIcons article={this.props.article}
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
