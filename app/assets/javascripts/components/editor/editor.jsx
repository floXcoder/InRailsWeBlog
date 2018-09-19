'use strict';

import {
    uploadImages,
    loadAutocomplete
} from '../../actions';

import EditorLoader from '../../loaders/editor';
import SanitizePaste from '../../modules/sanitizePaste';

export const EditorMode = {
    EDIT: 1,
    INLINE_EDIT: 2
};

export default class Editor extends React.Component {
    static propTypes = {
        modelName: PropTypes.string.isRequired,
        modelId: PropTypes.number,
        mode: PropTypes.number,
        id: PropTypes.string,
        placeholder: PropTypes.string,
        children: PropTypes.string,
        isDisabled: PropTypes.bool,
        isCodeView: PropTypes.bool,
        onLoaded: PropTypes.func,
        onFocus: PropTypes.func,
        onBlur: PropTypes.func,
        onKeyUp: PropTypes.func,
        onKeyDown: PropTypes.func,
        onPaste: PropTypes.func,
        onChange: PropTypes.func,
        onImageUpload: PropTypes.func,
        onSubmit: PropTypes.func
    };

    static defaultProps = {
        mode: EditorMode.EDIT,
        id: `summernote-${Utils.uuid()}`,
        isDisabled: false,
        isCodeView: false
    };

    constructor(props) {
        super(props);

        this._editorRef = null;
        this._editor = null;
        this._noteEditable = null;
        this._notePlaceholder = null;
    }

    componentDidMount() {
        EditorLoader(() => {
            let $editor = $(ReactDOM.findDOMNode(this._editorRef));

            const defaultOptions = {
                lang: I18n.locale + '-' + I18n.locale.toUpperCase(),
                styleTags: ['p', 'pre', 'h1', 'h2', 'h3', 'h4'],
                placeholder: this.props.placeholder,
                popatmouse: false,
                callbacks: {
                    onChange: this.props.onChange,
                    onFocus: this.props.onFocus,
                    onBlur: this.props.onBlur,
                    onKeyup: this.props.onKeyUp,
                    onKeydown: this._onKeyDown,
                    onPaste: (event) => {
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

                        if (text) {
                            if (msIE || firefox) {
                                setTimeout(() => {
                                    document.execCommand('insertHTML', false, SanitizePaste.parse(text, type));
                                }, 10);
                            } else {
                                document.execCommand('insertHTML', false, SanitizePaste.parse(text, type));
                            }
                        }
                    },
                    onImageUpload: this.onImageUpload
                },
                hint: {
                    mentions: ['Type article name'],
                    match: /\B#(\w*)$/,
                    search: (keyword, callback) => {
                        loadAutocomplete({
                            selectedTypes: 'article',
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

                this._editor = $editor.summernote({
                    ...defaultOptions,
                    airMode: true,
                    popover: {
                        air: airToolbar
                    }
                });
            } else {
                const toolbar = [
                    ['style', ['style', 'bold', 'italic', 'underline']],
                    ['para', ['ul', 'ol']],
                    ['specialStyle', ['code', 'pre', 'advice', 'secret']],
                    ['table', ['table']],
                    ['insert', ['link', 'picture', 'video']],
                    ['undo', ['undo', 'redo']],
                    ['clear', ['clear']],
                    ['view', ['fullscreen']],
                    ['help', ['codeview', 'help']]
                ];

                this._editor = $editor.summernote({
                    ...defaultOptions,
                    toolbar: toolbar,
                    followingToolbar: true,
                    otherStaticBar: '.nav-wrapper',
                });

                if (this.props.isCodeView) {
                    this._editor.summernote('codeview.activate');
                }
            }

            const $container = this._editor.parent();
            this._noteEditable = $container.find('.note-editable');
            this._notePlaceholder = $container.find('.note-placeholder');

            if (typeof this.props.isDisabled === 'boolean') {
                this.toggleState(this.props.isDisabled);
            }

            if (this.props.onLoaded) {
                this.props.onLoaded(this);
            }
        });
    }

    shouldComponentUpdate() {
        // Do not update
        return false;
    }

    componentDidUpdate(prevProps) {
        if (this._editor) {
            const isCodeView = prevProps.isCodeView;
            const codeViewCommand = isCodeView ? 'codeview.activate' : 'codeview.deactivate';

            if (this.props.children !== prevProps.children) {
                this.replace(prevProps.children);
            }

            if (this.props.isDisabled !== prevProps.isDisabled) {
                this.toggleState(prevProps.isDisabled);
            }

            if (isCodeView !== this.props.isCodeView) {
                this._editor.summernote(codeViewCommand);
            }

            if (this.props.placeholder !== prevProps.placeholder) {
                this._notePlaceholder.html(prevProps.placeholder);
            }
        }
    }

    componentWillUnmount() {
        if (this._editor && this._editor.summernote) {
            this._editor.empty();
            this._editor.summernote('destroy');
        }
    }

    _onKeyDown = (event) => {
        if (this.props.onSubmit) {
            if (event.keyCode === 13 && event.ctrlKey) {
                event.preventDefault();

                this.props.onSubmit();
            }
        }
    };

    _formatContent = (content) => {
        return content && content.replace(/ data-src=/g, ' src=');
    };

    onImageUpload = (images) => {
        uploadImages(images, Utils.compact({
            model: this.props.modelName,
            modelId: this.props.modelId
        })).map((upload) => {
            upload.then((response) => {
                if (response.upload) {
                    this.insertImage(response.upload.url, response.upload.filename);

                    if (this.props.onImageUpload) {
                        this.props.onImageUpload(response.upload);
                    }
                }
            })
        });
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

    insertImage = (url, filenameOrCallback) => {
        if (this._editor) {
            this._editor.summernote('insertImage', url, filenameOrCallback);
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

    insertLink = () => {
        if (this._editor) {
            this._editor.summernote('code', '');
            this._editor.summernote('createLink', {
                text: text.trim(),
                url: text.trim(),
                isNewWindow: true
            });
        }
    };

    contentLength = () => {
        if (this._editor) {
            return this._editor.summernote('code').replace(/<(?:.|\n)*?>/gm, '').length;
        }
    };

    render() {
        const containerClassName = 'editor-reset';

        const editorClassName = classNames({
            'blog-article-content': this.props.mode === EditorMode.INLINE_EDIT
        });

        return (
            <div className={containerClassName}>
                <div ref={(editor) => this._editorRef = editor}
                     id={this.props.id}
                     className={editorClassName}
                     dangerouslySetInnerHTML={{__html: this._formatContent(this.props.children)}}/>
            </div>
        );
    }
}
