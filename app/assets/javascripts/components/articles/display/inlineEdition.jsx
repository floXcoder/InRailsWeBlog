'use strict';

import {
    editArticle,
    updateArticle,
    deleteArticle
} from '../../../actions';

import {
    getArticleIsOwner
} from '../../../selectors';

import ArticleEditionIcons from '../icons/edition';
import ArticleLinkIcon from '../icons/link';

import Editor, {EditorMode} from '../../editor/editor';

@connect((state, props) => ({
    isOwner: getArticleIsOwner(state, props.article)
}), {
    editArticle,
    updateArticle,
    deleteArticle
})
export default class ArticleEditionDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        // From connect
        isOwner: PropTypes.bool,
        editArticle: PropTypes.func,
        updateArticle: PropTypes.func,
        deleteArticle: PropTypes.func
    };

    constructor(props) {
        super(props);

        this._editor = null;
    }

    // TODO: user article global state to store this state
    // state = {
    //     isLink: false
    // };
    //
    // _handleEditorChange (event) {
    //     let text = event.currentTarget.textContent;
    //
    //     if (Utils.isURL(text.trim()) && !this.state.isLink) {
    //         this.setState({isLink: true});
    //         this._editor.reset();
    //         this.state.editor.summernote("createLink", {
    //             text: text.trim(),
    //             url: text.trim(),
    //             isNewWindow: true
    //         });
    //     } else if (this.state.isLink && !Utils.isURL(text.trim())) {
    //         this.state.isLink = false;
    //         this.setState({isLink: false});
    //     }
    // }

    _handleDeleteClick = () => {
        this.props.deleteArticle(this.props.article.id);
    };

    _handleCancelClick = () => {
        this.props.editArticle(null);
    };

    _handleSaveClick = () => {
        const content = this._editor.getContent();
        this.props.updateArticle({
            id: this.props.article.id,
            content: content
        }).then(() => this.props.editArticle(null));
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
                            mode={EditorMode.INLINE_EDIT}
                            onSubmit={this._handleSaveClick}
                            onEditorLoaded={this._handleEditorLoaded}>
                        {this.props.article.content}
                    </Editor>
                </div>

                <div className="clearfix">
                    {
                        // this.props.article.tags.map((tag) => (
                        //     <a key={tag.id}
                        //        className="btn-small waves-effect waves-light">
                        //         {tag.name}
                        //     </a>
                        // ))
                    }

                    <div className="right">
                        <ArticleEditionIcons onDeleteClick={this._handleDeleteClick}
                                             onCancelClick={this._handleCancelClick}
                                             onSaveClick={this._handleSaveClick}
                                             isOwner={this.props.isOwner}/>

                        <ArticleLinkIcon isLink={this.props.article.isLink}/>
                    </div>
                </div>
            </div>
        );
    }
}
