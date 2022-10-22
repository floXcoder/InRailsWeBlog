'use strict';

import {
    Link
} from 'react-router-dom';

import {
    Field
} from 'react-final-form';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import CompareIcon from '@mui/icons-material/Compare';

import {
    compareArticleParam
} from '../../../../constants/routesHelper';

import EditorField from '../../../editor/form/editor';

import TabContainer from '../../../material-ui/tabContainer';
import TextFormField from '../../../material-ui/form/text';


export default class ArticleCommonField extends React.Component {
    static propTypes = {
        currentMode: PropTypes.string.isRequired,
        currentUserId: PropTypes.number.isRequired,
        currentTopicId: PropTypes.number.isRequired,
        change: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        topicLanguages: PropTypes.array,
        isPaste: PropTypes.bool,
        article: PropTypes.object
    };

    static defaultProps = {
        isPaste: false,
        article: {}
    };

    constructor(props) {
        super(props);

        this._editor = null;
        this._pictureIds = [];
    }

    state = {
        tabStep: 0
    };

    _handleTabChange = (event, value) => {
        this.setState({tabStep: value});
    };

    _handleEditorLoaded = (editor) => {
        this._editor = editor;
    };

    _handleImageUploaded = (image) => {
        this._pictureIds.push(image.id);

        this.props.change('picture_ids', this._pictureIds.join(','));
    };

    _handleTitleBlur = (event) => {
        if (this._editor) {
            this._editor.focus();
        }

        return event;
    };

    _handleTitleKeyPress = (event) => {
        if (Utils.NAVIGATION_KEYMAP[event.which] === 'enter') {
            if (event.ctrlKey) {
                this.props.onSubmit();
            } else if (this._editor) {
                this._editor.focus();
            }
        }

        return event;
    };

    _renderTitleField = (locale) => {
        if (this.props.currentMode === 'link') {
            return (
                <div className="col s12">
                    <div className="form-editor-title">
                        {I18n.t('js.article.model.reference')}
                    </div>

                    <Field name="reference"
                           component={TextFormField}
                           id="article_reference"
                           icon="link"
                           variant="standard"
                           label={I18n.t(`js.article.common.placeholders.reference.${this.props.currentMode}`)}
                           characterCount={window.settings.article_title_max_length}
                           onBlur={this._handleTitleBlur}/>
                </div>
            );
        } else {
            const fieldId = locale ? `article_title_${locale}` : 'article_title';
            const fieldName = locale ? `title_translations[${locale}]` : 'title';

            return (
                <div className="col s12">
                    <Field name={fieldName}
                           component={TextFormField}
                           className="article-form-title-field"
                           id={fieldId}
                           label={I18n.t(`js.article.common.placeholders.title.${this.props.currentMode}`)}
                           autoFocus={true}
                           spellCheck="true"
                           required={true}
                           variant="standard"
                           color="primary"
                           onBlur={this._handleTitleBlur}
                           onKeyPress={this._handleTitleKeyPress}/>
                </div>
            );
        }
    };

    _renderContentField = (locale) => {
        const fieldName = locale ? `content_translations[${locale}]` : 'content';

        return (
            <div className="col s12">
                <Field name={fieldName}
                       component={EditorField}
                       id={`article_content_${locale || 'field'}`}
                       modelName="article"
                       modelId={this.props.article.id}
                       currentLocale={locale}
                       currentUserId={this.props.currentUserId}
                       currentTopicId={this.props.currentTopicId}
                       isPaste={this.props.isPaste}
                       placeholder={I18n.t(`js.article.common.placeholders.content.${this.props.currentMode}`)}
                       onLoaded={this._handleEditorLoaded}
                       onImageUpload={this._handleImageUploaded}
                       onSubmit={this.props.onSubmit}/>
            </div>
        );
    };

    render() {
        const currentLanguages = this.props.topicLanguages && this.props.article.languages && this.props.article.languages?.length > this.props.topicLanguages?.length ? this.props.article.languages : this.props.topicLanguages;

        return (
            <div className="row article-form-root">
                {
                    currentLanguages?.length > 1
                        ?
                        <>
                            {
                                !!this.props.article.id &&
                                <div className="article-form-compare-icon">
                                    <span className="flow-tooltip-bottom"
                                          data-tooltip={I18n.t('js.article.tooltip.compare')}>
                                        <Link to={'#' + compareArticleParam}>
                                            <CompareIcon color="primary"
                                                         fontSize="medium"/>
                                        </Link>
                                    </span>
                                </div>
                            }

                            <Tabs value={this.state.tabStep}
                                  indicatorColor="primary"
                                  textColor="primary"
                                  centered={true}
                                  onChange={this._handleTabChange}>
                                {
                                    currentLanguages.map((locale) => (
                                        <Tab key={locale}
                                             label={I18n.t(`js.languages.${locale}`)}/>
                                    ))
                                }
                            </Tabs>

                            {
                                currentLanguages.map((locale, i) => (
                                    <TabContainer key={locale}
                                                  isActive={this.state.tabStep === i}>
                                        {this._renderTitleField(locale)}

                                        {this._renderContentField(locale)}
                                    </TabContainer>
                                ))
                            }
                        </>
                        :
                        <>
                            {this._renderTitleField()}

                            {this._renderContentField()}
                        </>
                }
            </div>
        );
    }
}
