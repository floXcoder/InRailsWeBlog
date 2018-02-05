'use strict';

import {
    Link
} from 'react-router-dom';

import {
    inlineEditArticle,
    updateArticle,
    deleteArticle, spyTrackClick
} from '../../../actions';

import ArticleInlineActions from '../properties/inlineActions';

import Editor, {EditorMode} from '../../editor/editor';

@connect(null, {
    inlineEditArticle,
    updateArticle,
    deleteArticle
})
export default class ArticleInlineEditionDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        isOwner: PropTypes.bool,
        // From connect
        inlineEditArticle: PropTypes.func,
        updateArticle: PropTypes.func,
        deleteArticle: PropTypes.func
    };

    constructor(props) {
        super(props);

        this._editor = null;
    }

    _handleDeleteClick = () => {
        this.props.deleteArticle(this.props.article.id);
    };

    _handleCancelClick = () => {
        this.props.inlineEditArticle(null);
    };

    _handleSaveClick = () => {
        const content = this._editor.getContent();

        this.props.updateArticle({
            id: this.props.article.id,
            content: content
        })
            .then(() => this.props.inlineEditArticle(null));
    };

    render() {
        return (
            <div className="article-inline-edition">
                {
                    this.props.article.title &&
                    <div className="article-inline-title">
                        <Link to={`/article/${this.props.article.slug}`}
                              onClick={spyTrackClick.bind(null, 'article', this.props.article.id)}>
                            <h2 className="title">
                                {this.props.article.title}
                            </h2>
                        </Link>
                    </div>
                }

                <div className="article-inline-edition-content">
                    <Editor ref={(editor) => this._editor = editor}
                            mode={EditorMode.INLINE_EDIT}
                            onSubmit={this._handleSaveClick}
                            onEditorLoaded={this._handleEditorLoaded}>
                        {this.props.article.content}
                    </Editor>
                </div>

                <div className="article-actions">
                    <div className="article-actions-text">
                        {I18n.t('js.article.common.actions')}
                    </div>

                    <ArticleInlineActions onDeleteClick={this._handleDeleteClick}
                                          onCancelClick={this._handleCancelClick}
                                          onSaveClick={this._handleSaveClick}/>
                </div>

                {
                    // TODO: display tags?
                    // this.props.article.tags.map((tag) => (
                    //     <a key={tag.id}
                    //        className="btn-small waves-effect waves-light">
                    //         {tag.name}
                    //     </a>
                    // ))
                }
            </div>
        );
    }
}
