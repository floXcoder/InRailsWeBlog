'use strict';

import {
    Link
} from 'react-router-dom';

import {
    Field
} from 'react-final-form';

import {
    withStyles
} from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import CompareIcon from '@material-ui/icons/Compare';

import {
    compareArticleParam
} from '../../../../constants/routesHelper';

import EditorField from '../../../editor/form/editor';

import TabContainer from '../../../material-ui/tabContainer';
import TextFormField from '../../../material-ui/form/text';

import styles from '../../../../../jss/article/form/shared';


export default @withStyles(styles)
class ArticleCommonField extends React.Component {
    static propTypes = {
        currentMode: PropTypes.string.isRequired,
        currentUserId: PropTypes.number.isRequired,
        currentTopicId: PropTypes.number.isRequired,
        change: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        topicLanguages: PropTypes.array,
        isPaste: PropTypes.bool,
        article: PropTypes.object,
        // from styles
        classes: PropTypes.object
    };

    static defaultProps = {
        isPaste: false,
        article: {}
    };

    constructor(props) {
        super(props);

        this._editor = null;
        this._pictureIds = null;
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
        this.props.change('picture_ids', this._pictureIds ? this._pictureIds.split(',').concat(image.id).join(',') : image.id.toString());
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
                           label={I18n.t(`js.article.common.placeholders.reference.${this.props.currentMode}`)}
                           characterCount={window.settings.article_title_max_length}
                           onBlur={this._handleTitleBlur}/>
                </div>
            );
        } else {
            const fieldName = locale ? `title_translations[${locale}]` : 'title';

            return (
                <div className="col s12">
                    <Field name={fieldName}
                           component={TextFormField}
                           className={this.props.classes.titleField}
                           id={`article_title_${locale}`}
                           label={I18n.t(`js.article.common.placeholders.title.${this.props.currentMode}`)}
                           autoFocus={true}
                           required={true}
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
            <div className={classNames('row', this.props.classes.root)}>
                {
                    currentLanguages?.length > 1
                        ?
                        <>
                            {
                                this.props.article.id &&
                                <div className={this.props.classes.compareIcon}>
                                    <span className="flow-tooltip-bottom"
                                          data-tooltip={I18n.t('js.article.tooltip.compare')}>
                                        <Link to={'#' + compareArticleParam}>
                                            <CompareIcon color="primary"
                                                         fontSize="default"/>
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
