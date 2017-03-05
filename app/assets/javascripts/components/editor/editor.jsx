'use strict';

import EditorLoader from '../../loaders/editor';

export default class Editor extends React.Component {
    static propTypes = {
        mode: React.PropTypes.number,
        id: React.PropTypes.string,
        children: React.PropTypes.string,
        onEditorLoaded: React.PropTypes.func,
        onEditorInput: React.PropTypes.func
    };

    static defaultProps = {
        mode: 1,
        id: 'editor',
        children: null,
        onEditorLoaded: null,
        onEditorInput: null
    };

    mode = {
        SHOW: 1,
        EDIT: 2,
        INLINE_EDIT: 3
    };

    constructor(props) {
        super(props);

        this.editor = null;
    }

    componentDidMount() {
        EditorLoader().then(({}) => {
            let $editor = $(ReactDOM.findDOMNode(this.refs.editor));

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
                if (window.innerWidth > window.parameters.medium_screen_up) {
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

                this.editor = $editor.summernote({
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
        if (this.editor) {
            this.editor.summernote('code', content);
        } else {
            return false;
        }
    };

    contentLength = () => {
        if (this.editor) {
            return this.editor.summernote('code').replace(/<(?:.|\n)*?>/gm, '').length;
        } else {
            return false;
        }
    };

    createLink = () => {
        if (this.editor) {
            this.editor.summernote('code', '');
            this.editor.summernote('createLink', {
                text: text.trim(),
                url: text.trim(),
                isNewWindow: true
            });
        } else {
            return false;
        }
    };

    focus = () => {
        if (this.editor) {
            this.editor.summernote('focus');
        } else {
            return false;
        }
    };

    serialize = () => {
        if (this.editor) {
            $('#' + this.props.id + '-serialized').val(this.editor.summernote('code'));
            return this.editor.summernote('code');
        } else {
            return false;
        }
    };

    reset = () => {
        if (this.editor) {
            this.editor.summernote('code', '');
        } else {
            return false;
        }
    };

    remove = () => {
        if (this.editor) {
            this.editor.summernote('destroy');
            this.editor.empty();
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
                    <div ref="editor"
                         id={this.props.id}
                         className={editorClassName}
                         dangerouslySetInnerHTML={{__html: this.props.children}}/>
                </div>
                <textarea ref="editorSerialized"
                          id={this.props.id + '-serialized'}
                          name="article[content]"
                          style={{display: 'none'}}
                          data-parsley-required={true}
                          data-parsley-strip-html={'[' + window.parameters.article_content_min_length + ',' + window.parameters.article_content_max_length + ']'}/>
            </div>
        );
    }
}
