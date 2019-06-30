'use strict';

import $ from 'jquery';

import withWidth from '@material-ui/core/withWidth';

import {
    uploadImages,
    deleteImage,
    loadAutocomplete
} from '../../actions';

import EditorLoader from '../../loaders/editor';
import SanitizePaste from '../../modules/sanitizePaste';

export const EditorMode = {
    EDIT: 1,
    INLINE_EDIT: 2
};

export default @withWidth()
class Editor extends React.Component {
    static propTypes = {
        modelName: PropTypes.string.isRequired,
        modelId: PropTypes.number,
        currentTopicId: PropTypes.number,
        mode: PropTypes.number,
        id: PropTypes.string,
        className: PropTypes.string,
        placeholder: PropTypes.string,
        children: PropTypes.string,
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
        // from withWidth
        width: PropTypes.string

    };

    static defaultProps = {
        mode: EditorMode.EDIT,
        id: `summernote-${Utils.uuid()}`,
        isDisabled: false,
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
        EditorLoader(() => {
            const $editor = $(this._editorRef.current);

            const defaultOptions = {
                lang: I18n.locale + '-' + I18n.locale.toUpperCase(),
                styleTags: ['p', 'h2', 'h3', 'h4'],
                placeholder: this.props.placeholder,
                popatmouse: false,
                callbacks: {
                    onFocus: this.props.onFocus,
                    onMousedown: this._handleMouseDown,
                    // onBlur: this.props.onBlur,
                    onKeyup: this.props.onKeyUp,
                    onKeydown: this._onKeyDown,
                    onChange: this._onChange,
                    onPaste: this._onPaste,
                    onImageUpload: this.onImageUpload,
                    onMediaDelete: this.onImageDelete
                },
                hint: {
                    mentions: ['Type article name'],
                    match: /\B#(\w*)$/,
                    search: (keyword, callback) => {
                        loadAutocomplete({
                            selectedTypes: 'article',
                            topicId: this.props.currentTopicId,
                            query: keyword,
                            limit: 5
                        }).then((results) => results.articles ? callback(results.articles.map((article) => [article.id, article.slug, article.title]).compact()) : [])
                    },
                    template: ([id, slug, title]) => {
                        return title;
                    },
                    content: ([id, slug, title]) => {
                        let nodeItem = document.createElement('a');
                        nodeItem.href = slug;
                        nodeItem.target = '_blank';
                        nodeItem.setAttribute('data-article-relation-id', id);
                        nodeItem.innerHTML = `#${title}`;
                        return nodeItem;
                    }
                }
            };

            if (this.props.mode === EditorMode.INLINE_EDIT) {
                let airToolbar = [
                    ['style', ['style', 'bold', 'italic', 'underline']],
                    ['specialStyle', ['pre', 'advice', 'secret']],
                    ['para', ['ul', 'ol']],
                    ['insert', ['link', 'picture', 'video']],
                    ['undo', ['undo', 'redo']],
                    ['clear', ['clear']]
                ];

                if (this.props.width === 'xs' || this.props.width === 'sm') {
                    airToolbar = [
                        ['style', ['style', 'bold', 'italic', 'underline']],
                        ['specialStyle', ['pre', 'advice', 'secret']],
                        ['para', ['ul', 'ol']],
                        ['insert', ['link', 'picture', 'video']]
                    ];
                }

                this._editor = $editor.summernote({
                    ...defaultOptions,
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
                    ['undo', ['undo', 'redo']],
                    // ['clear', ['clear']],
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

                this._editor = $editor.summernote({
                    ...defaultOptions,
                    toolbar: toolbar,
                    followingToolbar: true,
                    // otherStaticBar: '#article-edit-stepper',
                    otherStaticBarHeight: this.props.width === 'xs' ? 111 : (this.props.width === 'md' ? 128 : 142)
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
                '<div class="note-status-element">' + '</div>' + '<div class="note-status-helper">' + '</div>'
            );

            this._noteStatusElement = $container.find('.note-status-element');
            this._noteStatusHelper = $container.find('.note-status-helper');

            if (this.props.mode !== EditorMode.INLINE_EDIT) {
                this._noteStatusHelper.html(I18n.t('js.editor.helper.title') + ' <strong>#</strong> ' + I18n.t('js.editor.helper.article_hint'));
            }

            if (typeof this.props.isDisabled === 'boolean') {
                this.toggleState(this.props.isDisabled);
            }

            if (this.props.onLoaded) {
                this.props.onLoaded(this);
            }
        });
    }

    shouldComponentUpdate(nextProps) {
        return this.props.modelId !== nextProps.modelId || this.props.isDisabled !== nextProps.isDisabled || this.props.placeholder !== nextProps.placeholder;
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
        if (this._editor && this._editor.summernote) {
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
                event.preventDefault();

                this.props.onSubmit();
            }
        }
    };

    _onChange = (content) => {
        this.props.onChange(content);
    };

    _onPaste = (event) => {
        event.preventDefault();

        const userAgent = window.navigator.userAgent;
        let msIE = userAgent.indexOf('MSIE ');
        msIE = msIE > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./);
        const firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        let text;
        let type = 'plain';
        if (msIE) {
            text = window.clipboardData.getData('Text');
        } else {
            if (event.originalEvent.clipboardData.types.includes('text/html')) {
                text = event.originalEvent.clipboardData.getData('text/html');

                if (text) {
                    type = 'html';
                } else {
                    text = event.originalEvent.clipboardData.getData('text/plain');
                }
            } else {
                text = event.originalEvent.clipboardData.getData('text/plain');
            }
        }

        const $context = $(event.target).parent();

        const parsedContent = SanitizePaste.parse(text, type, $context);
        const insertType = type === 'html' ?  'insertHTML' : 'insertText';

        if (text) {
            if (msIE || firefox) {
                setTimeout(() => {
                    document.execCommand(insertType, false, parsedContent);
                }, 10);
            } else {
                document.execCommand(insertType, false, parsedContent);
            }
        }
    };

    _formatContent = (content) => {
        return content && content.replace(/ data-src=/g, ' src=');
    };

    _displayCurrentElement = () => {
        let displayNodeName;

        // Accessing to nodeName raises a "Permission denied to access property "nodeName"" when content is blank
        try {
            // let currentNode = document.getSelection().anchorNode;
            const range = this._editor.summernote('createRange');
            let currentNode = range.ec;

            if(!currentNode) {
                return;
            }

            if (currentNode.nodeName === '#text') {
                currentNode = currentNode.parentNode;
            }

            const nodeName = currentNode.nodeName.toLocaleLowerCase();
            displayNodeName = $.summernote.lang[I18n.locale + '-' + I18n.locale.toUpperCase()].style[nodeName];
        } catch(error) {
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
        })).map((upload) => {
            upload.then((response) => {
                if (response.upload) {
                    this.insertImage(response.upload.url, response.upload.filename, response.upload.id, [
                        {
                            maxWidth: '600',
                            url: response.upload.miniUrl
                        },
                        {
                            maxWidth: '992',
                            url: response.upload.mediumUrl
                        },
                        {
                            url: response.upload.url
                        }
                    ]);

                    if (this.props.onImageUpload) {
                        this.props.onImageUpload(response.upload);
                    }
                }
            })
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

    getContent = () => {
        if (this._editor) {
            return this._editor.summernote('code');
        }
    };

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

    insertImage = (url, filenameOrCallback, srcsets) => {
        if (this._editor) {
            this._editor.summernote('insertImage', url, filenameOrCallback, srcsets);
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
                     className={classNames({
                         'blog-article-content': this.props.mode === EditorMode.INLINE_EDIT
                     })}
                     dangerouslySetInnerHTML={{__html: this._formatContent(this.props.children)}}/>
            </div>
        );
    }
}
