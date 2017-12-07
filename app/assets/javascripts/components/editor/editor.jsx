'use strict';

import EditorLoader from '../../loaders/editor';

export default class Editor extends React.PureComponent {
    static propTypes = {
        mode: PropTypes.number,
        id: PropTypes.string,
        children: PropTypes.string,
        onEditorLoaded: PropTypes.func,
        onEditorInput: PropTypes.func
    };

    static defaultProps = {
        mode: 1,
        id: 'editor'
    };

    constructor(props) {
        super(props);

        this._editorRef = null;
        this._editor = null;
    }

    mode = {
        SHOW: 1,
        EDIT: 2,
        INLINE_EDIT: 3
    };

    componentDidMount() {
        EditorLoader().then(({}) => {
            let $editor = $(ReactDOM.findDOMNode(this._editorRef));

            if (this.props.mode === this.mode.INLINE_EDIT) {
                let airToolbar = [
                    ['style', ['style', 'bold', 'italic', 'underline']],
                    ['undo', ['undo', 'redo']],
                    ['view', ['fullscreen', 'codeview']],
                    ['para', ['ul', 'ol']],
                    ['insert', ['link', 'picture', 'video']]
                ];

                $editor.summernote({
                    airMode: true,
                    popover: {
                        air: airToolbar
                    },
                    lang: I18n.locale + '-' + I18n.locale.toUpperCase(),
                    callbacks: {
                        onKeyup: (event) => {
                            this.props.onEditorInput(event);
                        }
                    }
                });
            } else {
                let toolbar = [];
                if (window.innerWidth > window.settings.medium_screen_up) {
                    toolbar = [
                        ['style', ['style', 'bold', 'italic', 'underline']],
                        ['specialStyle', ['specialStyle']],
                        ['undo', ['undo', 'redo']],
                        ['view', ['fullscreen', 'codeview']],
                        ['para', ['ul', 'ol']],
                        ['table', ['table']],
                        ['insert', ['link', 'picture', 'video']],
                        ['help', ['help']]
                    ];
                } else {
                    toolbar = [
                        ['style', ['style', 'bold', 'italic', 'underline']],
                        ['specialStyle', ['specialStyle']],
                        ['view', ['fullscreen']],
                        ['para', ['ul', 'ol']],
                        ['insert', ['link', 'picture', 'video']]
                    ];
                }

                this._editor = $editor.summernote({
                    lang: I18n.locale + '-' + I18n.locale.toUpperCase(),
                    toolbar: toolbar,
                    otherStaticBarClass: 'nav-wrapper',
                    followingToolbar: true,
                    height: 300,
                    callbacks: {
                        onKeyup: (event) => {
                            this.props.onEditorInput(event);
                            return true;
                        }
                    }
                });
            }

            if (this.props.onEditorLoaded) {
                this.props.onEditorLoaded();
            }
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Do not update
        return false;
    }

    setContent = (content) => {
        if (this._editor) {
            this._editor.summernote('code', content);
        } else {
            return false;
        }
    };

    contentLength = () => {
        if (this._editor) {
            return this._editor.summernote('code').replace(/<(?:.|\n)*?>/gm, '').length;
        } else {
            return false;
        }
    };

    createLink = () => {
        if (this._editor) {
            this._editor.summernote('code', '');
            this._editor.summernote('createLink', {
                text: text.trim(),
                url: text.trim(),
                isNewWindow: true
            });
        } else {
            return false;
        }
    };

    focus = () => {
        if (this._editor) {
            this._editor.summernote('focus');
        } else {
            return false;
        }
    };

    serialize = () => {
        if (this._editor) {
            $('#' + this.props.id + '-serialized').val(this._editor.summernote('code'));
            return this._editor.summernote('code');
        } else {
            return false;
        }
    };

    reset = () => {
        if (this._editor) {
            this._editor.summernote('code', '');
        } else {
            return false;
        }
    };

    remove = () => {
        if (this._editor) {
            this._editor.summernote('destroy');
            this._editor.empty();
        } else {
            return false;
        }
    };

    render() {
        const containerClassName = classNames({
            'editor-reset': this.props.mode !== this.mode.INLINE_EDIT,
            'article-editing': this.props.mode === this.mode.INLINE_EDIT
        });

        const editorClassName = classNames({
            'blog-article-content': this.props.mode === this.mode.INLINE_EDIT
        });

        return (
            <div>
                <div className={containerClassName}>
                    <div ref={(editor) => this._editorRef = editor}
                         id={this.props.id}
                         className={editorClassName}
                         dangerouslySetInnerHTML={{__html: this.props.children}}/>
                </div>
                <textarea id={this.props.id + '-serialized'}
                          name="article[content]"
                          style={{display: 'none'}}
                          data-parsley-required={true}
                          data-parsley-strip-html={'[' + window.settings.article_content_min_length + ',' + window.settings.article_content_max_length + ']'}/>
            </div>
        );
    }
}
