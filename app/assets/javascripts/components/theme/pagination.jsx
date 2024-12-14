import React from 'react';
import PropTypes from 'prop-types';

import ReactPaginate from 'react-paginate';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import * as Utils from '@js/modules/utils';

import history from '@js/components/modules/history';

import '@css/components/pagination.scss';


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
        getPreviousHistory: PropTypes.func,
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

        if (props.initialPage === 1) {
            const previousData = props.getPreviousHistory('pagination') || {};
            this.state.selected = previousData.page || 0;
        }

        if (props.hasHistory) {
            props.onHistoryChanged('pagination', this._handleHistory);
        }

        if (!props.hasHistory && Utils.isEmpty(props.currentPage)) {
            console.error('Pagination: current page must be provided if no history');
        }
    }

    state = {
        selected: this.props.initialPage - 1
    };

    _handleHistory = (pagination) => {
        pagination ||= {selected: 0};

        this._handlePaginationClick(pagination, false);

        if (this._pagination) {
            this._pagination.setState({
                selected: pagination.selected
            });
        }
    };

    _handlePaginationClick = (pagination, addToHistory = true) => {
        if (this.props.onPaginationClick) {
            this.props.onPaginationClick({
                ...pagination,
                pagination: true
            });

            if (this.props.hasHistory && addToHistory) {
                this.props.addToHistory({pagination: {page: pagination.selected}}, {page: pagination.selected > 0 ? pagination.selected + 1 : undefined});
            }
        }
    };

    render() {
        const {
            totalPages,
            // initialPage,
            currentPage,
            numOfPageShow,
            className
        } = this.props;

        const pageRangeDisplayed = Math.ceil(numOfPageShow / 2);
        const marginPagesDisplayed = Math.ceil(numOfPageShow / 4);

        if (totalPages <= 1) {
            return null;
        }

        return (
            <div className={className}>
                <ReactPaginate ref={(pagination) => this._pagination = pagination}
                               pageCount={totalPages}
                    // initialPage={this.state.selected}
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

export default history(Pagination);