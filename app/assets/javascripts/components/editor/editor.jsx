'use strict';

import $ from 'jquery';

import {
    userArticlePath,
    topicArticlesPath
} from '../../constants/routesHelper';

import {
    uploadImages,
    deleteImage,
    loadAutocomplete
} from '../../actions';

import {
    highlightedLanguagePrefix,
    highlightedLanguages
} from '../modules/constants';

import withWidth from '../modules/mediaQuery';

import '../../modules/summernote';
import SanitizePaste from '../../modules/sanitizePaste';

export const EDITOR_MODE = {
    EDIT: 1,
    INLINE_EDIT: 2
};


export default @withWidth()
class Editor extends React.Component {
    static propTypes = {
        modelName: PropTypes.string.isRequired,
        modelId: PropTypes.number,
        currentUserId: PropTypes.number,
        currentTopicId: PropTypes.number,
        mode: PropTypes.number,
        currentLocale: PropTypes.string,
        id: PropTypes.string,
        className: PropTypes.string,
        isPaste: PropTypes.bool,
        placeholder: PropTypes.string,
        children: PropTypes.string,
        hasOuterHeight: PropTypes.bool,
        otherStaticBar: PropTypes.string,
        noHelper: PropTypes.bool,
        isDisabled: PropTypes.bool,
        onLoaded: PropTypes.func,
        onFocus: PropTypes.func,
        // onBlur: PropTypes.func,
        onKeyUp: PropTypes.func,
        // onKeyDown: PropTypes.func,
        // onPaste: PropTypes.func,
        onChange: PropTypes.func,
        onImageUpload: PropTypes.func,
        onSubmit: PropTypes.func,
        onLazySubmit: PropTypes.func,
        // from withWidth
        width: PropTypes.string
    };

    static defaultProps = {
        mode: EDITOR_MODE.EDIT,
        id: `summernote-${Utils.uuid()}`,
        hasOuterHeight: true,
        isDisabled: false,
        noHelper: false,
        // isCodeView: false
    };

    constructor(props) {
        super(props);

        this._editorRef = React.createRef();
        this._editor = null;
        this._noteEditable = null;
        this._notePlaceholder = null;
        this._noteStatusElement = null;
        this._noteStatusHelper = null;
    }

    componentDidMount() {
        // EditorLoader(() => {
        const $editor = $(this._editorRef.current);

        const commonOptions = {
            lang: I18n.locale + '-' + I18n.locale.toUpperCase(),
            styleTags: ['p', 'h2', 'h3', 'h4'],
            placeholder: this.props.placeholder,
            popatmouse: false,
            useProtocol: true,
            // 0 - No break, the new paragraph remains inside the quote.
            // 1 - Break the first blockquote in the ancestors list.
            // 2 - Break all blockquotes, so that the new paragraph is not quoted. (default)
            blockquoteBreakingLevel: 2,
            codeLanguages: [{
                value: '',
                text: 'Auto'
            }].concat(highlightedLanguages.map((language) => (Array.isArray(language) ? language.map((l) => ({
                value: l,
                text: l
            })) : ({
                value: language,
                text: language
            })))),
            codeLanguagePrefix: highlightedLanguagePrefix,
            pasteSanitizer: this._formatPaste,
            callbacks: {
                onFocus: this.props.onFocus,
                onMousedown: this._handleMouseDown,
                // onBlur: this.props.onBlur,
                onKeyup: this.props.onKeyUp,
                onKeydown: this._onKeyDown,
                onChange: this._onChange,
                onImageUpload: this.onImageUpload,
                onMediaDelete: this.onImageDelete
            },
            hint: {
                mentions: [I18n.t('js.editor.hint.input')],
                match: /\B#(\w*)$/,
                search: (keyword, callback) => {
                    loadAutocomplete({
                        selectedTypes: ['article'],
                        userId: this.props.currentUserId,
                        topicId: this.props.currentTopicId,
                        titleOnly: true,
                        query: keyword,
                        limit: 8
                    }, this.props.currentLocale)
                        .then((results) => {
                            let autocompletes = [];

                            if (results.articles) {
                                autocompletes = autocompletes.concat(results.articles.map((article) => ['article', article.title, article.topicName, article.id, article.slug, article.userSlug])
                                    .compact());
                            }
                            // if (results.topics) {
                            //     autocompletes = autocompletes.concat(results.topics.map((topic) => ['topic', topic.name, topic.id, topic.slug, topic.userSlug])
                            //         .compact());
                            // }

                            if (autocompletes.length > 0) {
                                return callback(autocompletes);
                            } else {
                                return [];
                            }
                        });
                },
                template: ([type, title, topicName/* id, slug, parentSlug */]) => {
                    if (type === 'topic') {
                        return title + ' (' + I18n.t(`js.editor.hint.${type}`) + ')';
                    } else {
                        return `${title} (${topicName})`;
                    }
                },
                content: ([type, title, topicName, id, slug, parentSlug]) => {
                    const nodeItem = document.createElement('a');
                    nodeItem.target = '_blank';
                    // if (type === 'topic') {
                    //     nodeItem.href = topicArticlesPath(parentSlug, slug);
                    //     nodeItem.innerHTML = `#${title}`;
                    // } else {
                    nodeItem.href = userArticlePath(parentSlug, slug);
                    nodeItem.setAttribute('data-article-relation-id', id);
                    nodeItem.innerHTML = `#${title}`;
                    // }
                    return nodeItem;
                }
            }
        };

        let toolbarDisplayMode = this.props.mode;
        if (this.props.width === 'xs' || this.props.width === 'sm' || this.props.width === 'md') {
            toolbarDisplayMode = EDITOR_MODE.INLINE_EDIT;
        }

        if (toolbarDisplayMode === EDITOR_MODE.INLINE_EDIT) {
            let airToolbar = [
                ['style', ['style', 'bold', 'italic', 'underline']],
                ['specialStyle', ['pre', 'advice', 'secret']],
                ['para', ['ul', 'ol']],
                ['insert', ['link', 'picture', 'video']],
                ['clear', ['clear']],
                ['undo', ['undo', 'redo']]
            ];

            if (this.props.width === 'xs' || this.props.width === 'sm') {
                airToolbar = [
                    ['style', ['style', 'bold', 'italic', 'underline', 'pre', 'ul']],
                    ['insert', ['link', 'picture', 'clear', 'undo', 'redo']]
                ];
            }

            this._editor = $editor.summernote({
                ...commonOptions,
                airMode: true,
                popover: {
                    air: airToolbar
                }
            });
        } else {
            let toolbar = [
                ['style', ['style', 'bold', 'italic', 'underline']],
                ['para', ['ul', 'ol']],
                ['specialStyle', ['code', 'pre', 'advice', 'secret']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'video']],
                ['clear', ['cleaner']],
                ['undo', ['undo', 'redo']],
                // ['view', ['fullscreen']],
                // ['help', ['codeview', 'help']]
            ];

            if (this.props.width === 'xs' || this.props.width === 'sm') {
                toolbar = [
                    ['style', ['style', 'bold', 'italic', 'underline']],
                    ['para', ['ul', 'ol']],
                    ['specialStyle', ['code', 'pre', 'advice', 'secret']],
                    ['insert', ['link', 'picture', 'video']]
                ];
            }

            const toolbarOptions = {
                toolbar: toolbar,
                followingToolbar: true,
                // otherStaticBar: '#article-edit-stepper',
            };

            if (this.props.otherStaticBar) {
                toolbarOptions.otherStaticBar = this.props.otherStaticBar;
            } else if (this.props.hasOuterHeight) {
                toolbarOptions.otherStaticBarHeight = this.props.width === 'xs' ? 111 : (this.props.width === 'md' ? 128 : 126);
            }

            this._editor = $editor.summernote({
                ...commonOptions,
                ...toolbarOptions
            });

            // if (this.props.isCodeView) {
            //     this._editor.summernote('codeview.activate');
            // }
        }

        const $container = this._editor.parent();
        this._noteEditable = $container.find('.note-editable');
        this._notePlaceholder = $container.find('.note-placeholder');

        const $statusBar = $container.find('.note-status-output');
        $statusBar.html(
            '<div class="note-status-element"></div><div class="note-status-helper"></div>'
        );

        this._noteStatusElement = $container.find('.note-status-element');
        this._noteStatusHelper = $container.find('.note-status-helper');

        if (toolbarDisplayMode !== EDITOR_MODE.INLINE_EDIT && !this.props.noHelper) {
            this._noteStatusHelper.html(I18n.t('js.editor.helper.title') + ' <strong>#</strong> ' + I18n.t('js.editor.helper.article_hint'));
        }

        if (typeof this.props.isDisabled === 'boolean') {
            this.toggleState(this.props.isDisabled);
        }

        if (this.props.onLoaded) {
            this.props.onLoaded(this);
        }
        // });
    }

    shouldComponentUpdate(nextProps) {
        return this.props.modelId !== nextProps.modelId || this.props.isDisabled !== nextProps.isDisabled || this.props.placeholder !== nextProps.placeholder || this.props.width !== nextProps.width;
    }

    componentDidUpdate(prevProps) {
        if (this._editor) {
            if (prevProps.children !== this.props.children) {
                this.replace(this.props.children);
            }

            if (prevProps.isDisabled !== this.props.isDisabled) {
                this.toggleState(this.props.isDisabled);
            }

            // const isCodeView = prevProps.isCodeView;
            // const codeViewCommand = isCodeView ? 'codeview.activate' : 'codeview.deactivate';
            // if (isCodeView !== this.props.isCodeView) {
            //     this._editor.summernote(codeViewCommand);
            // }

            if (prevProps.placeholder !== this.props.placeholder) {
                this._notePlaceholder.html(this.props.placeholder);
            }
        }
    }

    componentWillUnmount() {
        if (this._editor?.summernote) {
            this._editor.empty();
            this._editor.summernote('destroy');
        }
    }

    _handleMouseDown = (event) => {
        this._displayCurrentElement();

        return event;
    };

    _onKeyDown = (event) => {
        this._displayCurrentElement();

        if (this.props.onSubmit) {
            if (event.keyCode === 13 && event.ctrlKey) {
                // CTRL+ENTER
                event.preventDefault();

                this.props.onSubmit();
            } else if (event.keyCode === 83 && event.ctrlKey) {
                // CTRL+S
                event.preventDefault();

                this.props.onLazySubmit();
            }
        }
    };

    _onChange = (content) => {
        this.props.onChange(content);
    };

    _formatPaste = (text, type, parentContext) => {
        return SanitizePaste.parse(text, type, parentContext);
    };

    _formatContent = (content) => {
        if (content) {
            if (this.props.isPaste) {
                return SanitizePaste.parse(content);
            } else {
                return content.replace(/ data-src=/g, ' src=');
            }
        }
    };

    _displayCurrentElement = () => {
        let displayNodeName;

        // Accessing to nodeName raises a 'Permission denied to access property "nodeName"' when content is blank
        try {
            // let currentNode = document.getSelection().anchorNode;
            const range = this._editor.summernote('createRange');
            let currentNode = range.ec;

            if (!currentNode) {
                return;
            }

            if (currentNode.nodeName === '#text') {
                currentNode = currentNode.parentNode;
            }

            const nodeName = currentNode.nodeName.toLocaleLowerCase();
            displayNodeName = $.summernote.lang[I18n.locale + '-' + I18n.locale.toUpperCase()].style[nodeName];
        } catch (error) {
            // Do nothing
        }

        if (displayNodeName) {
            this._setStatusBarElement(displayNodeName);
        }
    };

    _setStatusBarElement = (content) => {
        this._noteStatusElement.text(content);
    };

    onImageUpload = (images) => {
        uploadImages(images, Utils.compact({
            model: this.props.modelName,
            modelId: this.props.modelId
        }), (responses) => {
            responses.forEach((upload) => {
                upload.then((response) => {
                    if (response?.data?.attributes) {
                        this.insertImage(response.data.attributes.url.jpg, response.data.attributes.filename, response.data.attributes.id, [
                            {
                                maxWidth: '600',
                                url: response.data.attributes.miniUrl.jpg,
                                webp: response.data.attributes.miniUrl.webp
                            },
                            {
                                maxWidth: '992',
                                url: response.data.attributes.mediumUrl.jpg,
                                webp: response.data.attributes.mediumUrl.webp
                            },
                            {
                                url: response.data.attributes.url.jpg,
                                webp: response.data.attributes.url.webp
                            }
                        ]);

                        if (this.props.onImageUpload) {
                            this.props.onImageUpload(response.data.attributes);
                        }
                    }
                });
            });
        });
    };

    onImageDelete = (target) => {
        if (target[0] && target[0].dataset.id) {
            deleteImage(target[0].dataset.id);
        }
    };

    focus = () => {
        if (this._editor) {
            this._editor.summernote('focus');
        }
    };

    isEmpty = () => {
        if (this._editor) {
            return this._editor.summernote('isEmpty');
        }
    };

    // getContent = () => {
    //     if (this._editor) {
    //         return this._editor.summernote('code');
    //     }
    // };

    reset = () => {
        if (this._editor) {
            this._editor.summernote('reset');
        }
    };

    replace = (newContent) => {
        if (this._editor) {
            const prevContent = this._noteEditable.html();
            const contentLength = newContent.length;

            if (prevContent !== newContent) {
                if (this.isEmpty() && contentLength > 0) {
                    this._notePlaceholder.hide();
                } else if (contentLength === 0) {
                    this._notePlaceholder.show();
                }

                this._noteEditable.html(newContent);
            }
        }
    };

    disable = () => {
        if (this._editor) {
            this._editor.summernote('disable');
        }
    };

    enable = () => {
        if (this._editor) {
            this._editor.summernote('enable');
        }
    };

    toggleState = (disabled) => {
        if (disabled) {
            this.disable();
        } else {
            this.enable();
        }
    };

    insertImage = (url, filenameOrCallback, pictureId, srcsets) => {
        if (this._editor) {
            this._editor.summernote('insertImage', url, filenameOrCallback, pictureId, srcsets);
        }
    };

    insertNode = (node) => {
        if (this._editor) {
            this._editor.summernote('insertNode', node);
        }
    };

    insertText = (text) => {
        if (this._editor) {
            this._editor.summernote('insertText', text);
        }
    };

    // insertLink = () => {
    //     if (this._editor) {
    //         this._editor.summernote('code', '');
    //         this._editor.summernote('createLink', {
    //             text: text.trim(),
    //             url: text.trim(),
    //             isNewWindow: true
    //         });
    //     }
    // };
    //
    // contentLength = () => {
    //     if (this._editor) {
    //         return this._editor.summernote('code').replace(/<(?:.|\n)*?>/gm, '').length;
    //     }
    // };

    render() {
        return (
            <div className={classNames('editor-reset', this.props.className)}>
                <div ref={this._editorRef}
                     id={this.props.id}
                     dangerouslySetInnerHTML={{__html: this._formatContent(this.props.children)}}/>
            </div>
        );
    }
}
