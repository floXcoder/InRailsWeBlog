'use strict';

import Input from '../../../materialize/input';
import Editor from '../../../editor/editor';

export default class ArticleCommonField extends React.Component {
    static propTypes = {
        article: React.PropTypes.object,
        multipleId: React.PropTypes.number,
        onInputsChange: React.PropTypes.func,
        onIsLinkChange: React.PropTypes.func
    };

    static defaultProps = {
        article: null,
        multipleId: 0,
        onInputsChange: null,
        onIsLinkChange: null
    };

    state = {};

    constructor(props) {
        super(props);

        this._title = null;
        this._summary = null;
        this._editor = null;
    }

    _handleEditorLoaded() {
        if (this._title) {
            this._title.focus();
        }
    }

    _handleInputsChange(event) {
        this.props.onInputsChange({
            titleLength: this._title.value().length,
            summaryLength: this._summary.value().length,
            contentLength: this._editor.contentLength()
        });

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

        return event;
    }

    _onSummaryBlurred(event) {
        if (this._editor) {
            this._editor.focus();
        }

        return event;
    }

    serialize() {
        if (this._editor) {
            this._editor.serialize();
        }
    }

    render() {
        return (
            <div>
                <Input ref={(title) => this._title = title}
                       id="article_title"
                       multipleId={this.props.multipleId}
                       title={I18n.t('js.article.model.title')}
                       validator={{
                           'data-parsley-required': true,
                           'data-parsley-minlength': window.parameters.article_title_min_length,
                           'data-parsley-maxlength': window.parameters.article_title_max_length,
                           'data-parsley-minlength-message': I18n.t('js.article.errors.title.size', {
                               min: window.parameters.article_title_min_length,
                               max: window.parameters.article_title_max_length
                           }),
                           'data-parsley-maxlength-message': I18n.t('js.article.errors.title.size', {
                               min: window.parameters.article_title_min_length,
                               max: window.parameters.article_title_max_length
                           })
                       }}
                       characterCount={window.parameters.article_title_max_length}
                       onInput={this._handleInputsChange}>
                    {this.props.article && this.props.article.title}
                </Input>

                <Input ref={(summary) => this._summary = summary}
                       id="article_summary"
                       multipleId={this.props.multipleId}
                       title={I18n.t('js.article.model.summary')}
                       validator={{
                           'data-parsley-minlength': window.parameters.article_summary_min_length,
                           'data-parsley-maxlength': window.parameters.article_summary_max_length,
                           'data-parsley-minlength-message': I18n.t('js.article.errors.summary.size', {
                               min: window.parameters.article_summary_min_length,
                               max: window.parameters.article_summary_max_length
                           }),
                           'data-parsley-maxlength-message': I18n.t('js.article.errors.summary.size', {
                               min: window.parameters.article_summary_min_length,
                               max: window.parameters.article_summary_max_length
                           })
                       }}
                       characterCount={window.parameters.article_summary_max_length}
                       onBlur={this._onSummaryBlurred}
                       onInput={this._handleInputsChange}>
                    {this.props.article && this.props.article.summary}
                </Input>

                <div className="form-editor-title">
                    {I18n.t('js.article.model.content')}
                </div>

                <Editor ref={(editor) => this._editor = editor}
                        onEditorLoaded={this._handleEditorLoaded}
                        onEditorInput={this._handleInputsChange}>
                    {this.props.article && this.props.article.content}
                </Editor>
            </div>
        );
    }
}
