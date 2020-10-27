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
import Typography from '@material-ui/core/Typography';

import CompareIcon from '@material-ui/icons/Compare';

import {
    compareArticleParam
} from '../../../../constants/routesHelper';

import EditorField from '../../../editor/form/editor';

import TextFormField from '../../../material-ui/form/text';

import styles from '../../../../../jss/article/form/shared';

function TabContainer(props) {
    return (
        <Typography component="div"
                    className={props.isActive ? null : 'hide'}>
            {props.children}
        </Typography>
    );
}

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

    _renderTitle = (locale) => {
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

    _renderContent = (locale) => {
        const fieldName = locale ? `content_translations[${locale}]` : 'content';

        return (
            <div className="col s12">
                <Field name={fieldName}
                       component={EditorField}
                       id={`article_content_${locale}`}
                       modelName="article"
                       modelId={this.props.article.id}
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
        return (
            <div className={classNames('row', this.props.classes.root)}>
                {
                    (this.props.topicLanguages?.length > 1 || this.props.article.languages?.length > 1)
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
                                    this.props.topicLanguages.map((locale) => (
                                        <Tab key={locale}
                                             label={I18n.t(`js.languages.${locale}`)}/>
                                    ))
                                }
                            </Tabs>

                            {
                                this.props.topicLanguages.map((locale, i) => (
                                    <TabContainer key={locale}
                                                  isActive={this.state.tabStep === i}>
                                        {this._renderTitle(locale)}

                                        {this._renderContent(locale)}
                                    </TabContainer>
                                ))
                            }
                        </>
                        :
                        <>
                            {this._renderTitle()}

                            {this._renderContent()}
                        </>
                }
            </div>
        );
    }
}
