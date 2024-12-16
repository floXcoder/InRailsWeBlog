import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import VerticalAlignCenterIcon from '@mui/icons-material/VerticalAlignCenter';

import I18n from '@js/modules/translations';

import {
    fetchBlogs,
    addBlog,
    updateBlog
} from '@js/actions/admin';

import AdminBlogCard from '@js/components/admins/blogs/card';
import AdminBlogForm from '@js/components/admins/blogs/form';


class AdminBlogs extends React.Component {
    static propTypes = {
        // from connect
        blogs: PropTypes.array,
        isFetching: PropTypes.bool,
        fetchBlogs: PropTypes.func,
        addBlog: PropTypes.func,
        updateBlog: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    state = {
        isAddingBlog: false,
        editingBlog: undefined,
        isNew: true,
        isMinimized: false
    };

    componentDidMount() {
        this.props.fetchBlogs({}, {}, {noCache: true});
    }

    _handleExpandAll = (event) => {
        event.preventDefault();

        this.setState({
            isMinimized: !this.state.isMinimized
        });
    };

    _handleAddBlog = (isNew, event) => {
        event.preventDefault();

        this.setState({
            isAddingBlog: true,
            isNew
        });
    };

    _handleEditBlog = (blog) => {
        this.setState({
            editingBlog: blog,
            isNew: false
        });
    };

    _handlePersistBlog = (isNew, blog, data) => {
        if (isNew) {
            this.props.addBlog(data)
                .then(() => {
                    this.setState({
                        isAddingBlog: false,
                        editingBlog: undefined
                    });
                });
        } else {
            this.props.updateBlog(blog.id, data)
                .then(() => {
                    this.setState({
                        isAddingBlog: false,
                        editingBlog: undefined
                    });
                });
        }
    };

    _handleCancelBlog = (event) => {
        event.preventDefault();

        this.setState({
            editingBlog: undefined,
            isAddingBlog: false
        });
    };

    render() {
        const hasBlogs = this.props.blogs?.length > 0 && !this.props.isFetching;

        return (
            <div>
                <h1 className="center-align">
                    {I18n.t('js.admin.blogs.title')}
                </h1>

                <div className="center-align">
                    <Button color="primary"
                            variant="contained"
                            onClick={this._handleAddBlog.bind(this, true)}>
                        {I18n.t('js.admin.blogs.add')}
                    </Button>

                    {
                        !!hasBlogs &&
                        <a className="right"
                           href="#"
                           onClick={this._handleExpandAll}>
                            <VerticalAlignCenterIcon color="action"
                                                     fontSize="medium"/>
                        </a>
                    }
                </div>

                {
                    !!(this.state.isAddingBlog || this.state.editingBlog) &&
                    <Paper className="margin-top-30 margin-bottom-40"
                           elevation={1}>
                        <AdminBlogForm isNew={this.state.isNew}
                                       blog={this.state.editingBlog}
                                       onPersistBlog={this._handlePersistBlog}
                                       onCancelClick={this._handleCancelBlog}/>
                    </Paper>
                }

                {
                    !!hasBlogs &&
                    <div className="row">
                        <div className="col s12 margin-top-15">
                            {
                                this.props.blogs.map((blog) => (
                                    <AdminBlogCard key={blog.id}
                                                   blog={blog}
                                                   isMinimized={this.state.isMinimized}
                                                   onEditClick={this._handleEditBlog}/>
                                ))
                            }
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default connect((state) => ({
    blogs: state.adminState.blogs,
    isFetching: state.adminState.isFetching
}), {
    fetchBlogs,
    addBlog,
    updateBlog
})(AdminBlogs);