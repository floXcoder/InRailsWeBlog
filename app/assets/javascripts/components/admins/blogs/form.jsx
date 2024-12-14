import React, {
    Suspense
} from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button/Button';
import TextField from '@mui/material/TextField/TextField';

import I18n from '@js/modules/translations';

import {
    Editor
} from '@js/components/loaders/components';


export default class AdminBlogForm extends React.Component {
    static propTypes = {
        onPersistBlog: PropTypes.func.isRequired,
        onCancelClick: PropTypes.func.isRequired,
        blog: PropTypes.object,
        isNew: PropTypes.bool
    };

    static defaultProps = {
        blog: {},
        isNew: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        content: undefined
    };

    _handleEditorChange = (content) => {
        this.setState({
            content
        });
    };

    _handlePersistBlog = (blog, event) => {
        event.preventDefault();

        if (!event.target.checkValidity()) {
            return;
        }

        const form = event.target;
        const data = new FormData(form);

        data.append('blog[content]', this.state.content);

        this.props.onPersistBlog(this.props.isNew, blog, data);
    };

    render() {
        return (
            <form encType="multipart/form-data"
                  noValidate={true}
                  onSubmit={this._handlePersistBlog.bind(this, this.props.blog)}>
                <div className="row margin-top-20 margin-bottom-20">
                    <div className="col s12 center-align">
                        <TextField variant="outlined"
                                   margin="normal"
                                   name="blog[title]"
                                   label={I18n.t('js.admin.blogs.form.title')}
                                   autoFocus={true}
                                   defaultValue={this.props.blog.title}/>
                    </div>

                    <div className="col s12">
                        <Suspense fallback={<div/>}>
                            <Editor modelName="article"
                                    modelId={this.props.blog.id}
                                    mode={1}
                                    placeholder={I18n.t('js.admin.blogs.form.content')}
                                    hasOuterHeight={false}
                                    onChange={this._handleEditorChange}>
                                {this.props.blog.content}
                            </Editor>
                        </Suspense>
                    </div>

                    <div className="col s12 center-align margin-top-20">
                        <Button color="primary"
                                variant="outlined"
                                type="submit">
                            {
                                this.props.isNew
                                    ?
                                    I18n.t('js.admin.blogs.form.add')
                                    :
                                    I18n.t('js.admin.blogs.form.update')
                            }
                        </Button>

                        <br/>
                        <br/>

                        <Button color="primary"
                                variant="text"
                                onClick={this.props.onCancelClick}>
                            {I18n.t('js.admin.blogs.form.cancel')}
                        </Button>
                    </div>
                </div>
            </form>
        );
    }
}
