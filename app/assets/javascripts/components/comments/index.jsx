'use strict';

import {
    fetchComments
} from '../../actions';

import {
    getComments,
    getCommentPagination
} from '../../selectors';

import CommentTableDisplay from './display/table';

@connect((state, props) => ({
    hasInitialComments: !$.isEmpty(props.comments),
    isLoading: state.commentState.isFetching,
    comments: props.comments || getComments(state),
    commentPagination: getCommentPagination(state)
}), {
    fetchComments
})
export default class CommentIndex extends React.Component {
    static propTypes = {
        userId: PropTypes.number,
        isShowingLast: PropTypes.bool,
        filters: PropTypes.object,
        commentTotalPages: PropTypes.number,
        isPaginated: PropTypes.bool,
        onPaginationClick: PropTypes.func,
        isTable: PropTypes.bool,
        // From connect
        hasInitialComments: PropTypes.bool,
        isLoading: PropTypes.bool,
        comments: PropTypes.array,
        commentPagination: PropTypes.object,
        fetchComments: PropTypes.func
    };

    static defaultProps = {
        filters: {},
        isShowingLast: false,
        isPaginated: true,
        isTable: false
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (!this.props.hasInitialComments) {
            this.props.fetchComments({
                complete: this.props.isTable,
                filters: {
                    ...this.props.filters,
                    userId: this.props.userId,
                    order: this.props.isShowingLast ? 'updated_last' : null
                },
                page: 1
            });
        }
    }

    _handlePaginationClick = (paginate) => {
        if (this.props.onPaginationClick) {
            this.props.onPaginationClick({page: paginate.selected + 1});
        } else {
            let filters = {...this.props.filters};

            if (filters.not_accepted === 'on' || filters.not_accepted === '1') {
                filters.accepted = false;
            } else {
                filters.not_accepted = undefined;
            }

            this.props.fetchComments({
                complete: this.props.isTable,
                filters: {
                    ...filters,
                    userId: this.props.userId,
                    order: this.props.isShowingLast ? 'updated_last' : null
                },
                page: paginate.selected + 1
            });
        }
    };

    render() {
        return (
            <div className="row">
                <div className="col s12">
                    <CommentTableDisplay comments={this.props.comments}
                                         isLoading={this.props.isLoading}
                                         isPaginated={this.props.isPaginated}
                                         totalPages={this.props.commentPagination.totalPages}
                                         onPaginationClick={this._handlePaginationClick}
                                         isInlineEditing={true}
                                         hasFilter={true}
                                         filters={this.props.filters}/>
                </div>
            </div>
        );
    }
}

