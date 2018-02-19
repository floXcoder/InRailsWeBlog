'use strict';

import {
    uploadImages,
    loadAutocomplete
} from '../../actions';

import EditorLoader from '../../loaders/editor';

export const EditorMode = {
    EDIT: 1,
    INLINE_EDIT: 2
};

export default class Editor extends React.Component {
    static propTypes = {
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
                placeholder: this.props.placeholder,
                callbacks: {
                    onChange: this.props.onChange,
                    onFocus: this.props.onFocus,
                    onBlur: this.props.onBlur,
                    onKeyup: this.props.onKeyUp,
                    onKeydown: this._onKeyDown,
                    onPaste: this.props.onPaste,
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
                    ['specialStyle', ['advice', 'secret', 'cleaner']],
                    ['clear', ['clear']],
                    ['undo', ['undo', 'redo']],
                    ['para', ['ul', 'ol']],
                    ['insert', ['link', 'picture', 'video']]
                ];

                this._editor = $editor.summernote({
                    ...defaultOptions,
                    airMode: true,
                    popover: {
                        air: airToolbar
                    }
                });
            } else {
                // TODO: limit button if small screen
                const toolbar = [
                    ['style', ['style', 'bold', 'italic', 'underline']],
                    ['specialStyle', ['advice', 'secret', 'cleaner']],
                    ['clear', ['clear']],
                    ['undo', ['undo', 'redo']],
                    ['view', ['fullscreen']],
                    ['para', ['ul', 'ol']],
                    ['table', ['table']],
                    ['insert', ['link', 'picture', 'video']],
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

    componentWillReceiveProps(nextProps) {
        if (this._editor) {
            const isCodeView = nextProps.isCodeView;
            const codeViewCommand = isCodeView ? 'codeview.activate' : 'codeview.deactivate';


            if (this.props.children !== nextProps.children) {
                this.replace(nextProps.children);
            }

            if (this.props.isDisabled !== nextProps.isDisabled) {
                this.toggleState(nextProps.isDisabled);
            }

            if (isCodeView !== this.props.isCodeView) {
                this._editor.summernote(codeViewCommand);
            }

            if (this.props.placeholder !== nextProps.placeholder) {
                this._notePlaceholder.html(nextProps.placeholder);
            }
        }
    }

    shouldComponentUpdate() {
        // Do not update
        return false;
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

    onImageUpload = (images) => {
        uploadImages(images, {
            userId: 1,
            model: 'article',
            modelId: 1
        }).map((upload) => {
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
        const containerClassName = classNames({
            'editor-reset': this.props.mode !== EditorMode.INLINE_EDIT,
            'article-editing': this.props.mode === EditorMode.INLINE_EDIT
        });

        const editorClassName = classNames({
            'blog-article-content': this.props.mode === EditorMode.INLINE_EDIT
        });

        return (
            <div className={containerClassName}>
                <div ref={(editor) => this._editorRef = editor}
                     id={this.props.id}
                     className={editorClassName}
                     dangerouslySetInnerHTML={{__html: this.props.children}}/>
            </div>
        );
    }
}
