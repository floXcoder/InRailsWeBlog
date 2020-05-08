'use strict';

import '../../../stylesheets/components/pagination.scss';

import ReactPaginate from 'react-paginate';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import history from '../modules/history';

export default @history
class Pagination extends React.PureComponent {
    static propTypes = {
        totalPages: PropTypes.number,
        initialPage: PropTypes.number,
        currentPage: PropTypes.number,
        numOfPageShow: PropTypes.number,
        className: PropTypes.string,
        hasHistory: PropTypes.bool,
        onPaginationClick: PropTypes.func,
        // from history
        addToHistory: PropTypes.func,
        onHistoryChanged: PropTypes.func
    };

    static defaultProps = {
        totalPages: 0,
        initialPage: 1,
        numOfPageShow: 10,
        hasHistory: true
    };

    constructor(props) {
        super(props);

        this._pagination = null;

        if (props.hasHistory) {
            props.onHistoryChanged('pagination', this._handleHistory);
        }

        if (!props.hasHistory && Utils.isEmpty(props.currentPage)) {
            console.error('Pagination: current page must be provided if no history');
        }
    }

    state = {
        selected: 0
    };

    _handleHistory = (pagination) => {
        pagination = pagination || {selected: 0};

        this._handlePaginationClick(pagination, false);

        if (this._pagination) {
            this._pagination.setState({
                selected: pagination.selected
            });
        }
    };

    _handlePaginationClick = (pagination, addToHistory = true) => {
        if (this.props.onPaginationClick) {
            this.props.onPaginationClick(pagination);

            if (this.props.hasHistory && addToHistory) {
                this.props.addToHistory({pagination: {page: pagination.selected}});
            }
        }
    };

    render() {
        const {totalPages, initialPage, currentPage, numOfPageShow, className} = this.props;

        const pageRangeDisplayed = Math.ceil(numOfPageShow / 2);
        const marginPagesDisplayed = Math.ceil(numOfPageShow / 4);

        if (totalPages <= 1) {
            return null;
        }

        return (
            <div className={className}>
                <ReactPaginate ref={(pagination) => this._pagination = pagination}
                               pageCount={totalPages}
                               initialPage={initialPage - 1}
                               forcePage={currentPage ? (currentPage - 1) : this.state.selected}
                               disableInitialCallback={true}
                               pageRangeDisplayed={pageRangeDisplayed}
                               marginPagesDisplayed={marginPagesDisplayed}
                               previousLabel={<ChevronLeftIcon className="pagination-icon"/>}
                               nextLabel={<ChevronRightIcon className="pagination-icon"/>}
                               breakLabel={<span className="break">...</span>}
                               onPageChange={this._handlePaginationClick}
                               containerClassName="pagination center-align"
                               pageClassName="pagination-page"
                               activeClassName="active"
                               disabledClassName="disabled"/>
            </div>
        );
    }
}
