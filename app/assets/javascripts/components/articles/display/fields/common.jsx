'use strict';

import {
    Field
} from 'redux-form/immutable';

import TextField from '../../../materialize/form/text';
import EditorField from '../../../editor/form/editor';

// TODO: create autolink
// const content = event.currentTarget.textContent;
// if (!this.state.isLink && $.isURL(content.trim())) {
//     if (this._editor) {
//         this._editor.createLink();
//     }
//     if (this.props.onIsLinkChange) {
//         this.props.onIsLinkChange(true);
//     }
// } else if (this.state.isLink && !$.isURL(content.trim())) {
//     if (this.props.onIsLinkChange) {
//         this.props.onIsLinkChange(false);
//     }
// }

export default class ArticleCommonField extends React.Component {
    static propTypes = {
        article: PropTypes.object,
        multipleId: PropTypes.number,
        onInputsChange: PropTypes.func,
        onIsLinkChange: PropTypes.func
    };

    static defaultProps = {
        multipleId: 0
    };

    constructor(props) {
        super(props);

        this._editor = null;
    }

    _onSummaryBlurred = (event) => {
        if (this._editor) {
            // TODO
            // this._editor.focus();
        }

        return event;
    };

    render() {
        return (
            <div>
                <Field id="article_title"
                       name="title"
                       title={I18n.t('js.article.model.title')}
                       multipleId={this.props.multipleId}
                       characterCount={window.settings.article_title_max_length}
                       component={TextField}
                       componentContent={this.props.article && this.props.article.title}/>

                <Field id="article_summary"
                       name="summary"
                       title={I18n.t('js.article.model.summary')}
                       multipleId={this.props.multipleId}
                       characterCount={window.settings.article_summary_max_length}
                       onBlur={this._onSummaryBlurred}
                       component={TextField}
                       componentContent={this.props.article && this.props.article.summary}/>

                <div className="form-editor-title">
                    {I18n.t('js.article.model.content')}
                </div>

                <Field id="article_content"
                       name="content"
                       multipleId={this.props.multipleId}
                       component={EditorField}
                       componentContent={this.props.article && this.props.article.content}/>
            </div>
        );
    }
}
