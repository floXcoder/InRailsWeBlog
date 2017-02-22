'use strict';

const CommentActions = require('../../actions/commentActions');
const CommentStore = require('../../stores/commentStore');
const CommentTableDisplay = require('./display/table');

var CommentIndex = React.createClass({
    propTypes: {
        comments: React.PropTypes.array,
        limit: React.PropTypes.number,
        userId: React.PropTypes.number,
        isShowingLast: React.PropTypes.bool,
        filters: React.PropTypes.object,
        commentTotalPages: React.PropTypes.number,
        isPaginated: React.PropTypes.bool,
        onPaginationClick: React.PropTypes.func,
        isTable: React.PropTypes.bool
    },

    mixins: [
        Reflux.listenTo(CommentStore, 'onCommentChange')
    ],

    getDefaultProps () {
        return {
            comments: null,
            limit: 6,
            userId: null,
            isShowingLast: false,
            filters: null,
            commentTotalPages: null,
            isPaginated: true,
            onPaginationClick: null,
            isTable: false
        };
    },

    getInitialState () {
        return {
            comments: this.props.comments || [],
            commentsPagination: this.props.commentTotalPages ? {total_pages: this.props.commentTotalPages} : {}
        };
    },

    componentWillMount () {
        if (!this.props.comments) {
            let params = {page: 1};
            if (this.props.isTable) {
                params.complete = this.props.isTable;
            }

            params.filter = {};
            if (this.props.filters) {
                params.filter = this.props.filters;
            }
            if (this.props.userId) {
                params.filter.user_id = this.props.userId;
            }
            if (this.props.isShowingLast) {
                params.filter.order = 'updated_last';
            }

            CommentActions.loadComments(params);
        }
    },

    componentWillReceiveProps (nextProps) {
        if (!!nextProps.comments) {
            this.setState({
                comments: nextProps.comments,
                commentsPagination: {total_pages: nextProps.commentTotalPages}
            });
        }
    },

    shouldComponentUpdate (nextProps, nextState) {
        if (this.props.comments) {
            return !!this.state.comments.isEqualIds(nextState.comments);
        } else {
            return true;
        }
    },

    onCommentChange (commentData) {
        if ($.isEmpty(commentData)) {
            return;
        }

        let newState = {};

        if (commentData.type === 'loadComments') {
            newState.comments = commentData.comments;
            newState.commentsPagination = commentData.pagination;
        }

        if (commentData.type === 'updateComment') {
            newState.comments = this.state.comments.replace('id', commentData.comment);
        }

        if (commentData.type === 'deleteComment') {
            newState.comments = _.remove(this.state.comments, (comment) => {
                return comment.id != commentData.deletedComment.id
            });
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    },

    _handlePaginationClick(paginate)
    {
        if (this.props.onPaginationClick) {
            this.props.onPaginationClick(paginate);
        } else {
            CommentActions.loadComments({page: paginate.selected + 1});
        }
    },

    render()
    {
        let displayType = 'table';

        return (
            <div className="row">
                <div className="col s12">
                    {
                        displayType === 'table' &&
                        <CommentTableDisplay comments={this.state.comments}
                                             isPaginated={this.props.isPaginated}
                                             totalPages={this.state.commentsPagination && this.state.commentsPagination.total_pages}
                                             onPaginationClick={this._handlePaginationClick}
                                             isInlineEditing={true}
                                             hasFilter={true}
                                             filters={this.props.filters}/>
                    }
                </div>
            </div>
        );
    }
});

module.exports = CommentIndex;
