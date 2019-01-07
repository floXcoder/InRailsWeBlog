'use strict';

import {
    withRouter,
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
} from '../../../actions';

import ArticleInlineActions from '../properties/inlineActions';

import Editor, {EditorMode} from '../../editor/editor';

import styles from '../../../../jss/article/inline';

export default @withRouter
@connect(null, {
    inlineEditArticle,
    updateArticle,
    deleteArticle
})
@withStyles(styles)
class ArticleInlineEditionDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        // from connect
        inlineEditArticle: PropTypes.func,
        updateArticle: PropTypes.func,
        deleteArticle: PropTypes.func,
        // from withRouter
        history: PropTypes.object,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);

        this._editor = null;
    }

    state = {
        isModified: false
    };

    _handleTitleClick = (event) => {
        // event.preventDefault();

        spyTrackClick('article', this.props.article.id, this.props.article.slug, this.props.article.title);

        // const position = ReactDOM.findDOMNode(this._headerRed).getBoundingClientRect();
        //
        // this.props.history.push({
        //     pathname: `/users/${this.props.article.user.slug}/articles/${this.props.article.slug}`,
        //     state: {
        //         position: {x: position.x, y: position.y},
        //         title: this.props.article.title
        //     }
        // });
    };

    _handleDeleteClick = () => {
        this.props.deleteArticle(this.props.article.id);
    };

    _handleCancelClick = () => {
        this.props.inlineEditArticle(null);
    };

    _handleEditorChange = () => {
        if (!this.state.isModified) {
            this.setState({
                isModified: true
            });
        }
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
            <div className={this.props.classes.root}>
                <Prompt
                    when={this.state.isModified}
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
                    <Editor ref={(editor) => this._editor = editor}
                            modelName="article"
                            modelId={this.props.article.id}
                            mode={EditorMode.INLINE_EDIT}
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
