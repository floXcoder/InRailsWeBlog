'use strict';

const ReactPaginate = require('react-paginate');

const Pagination = ({totalPages, numOfPageShow, className, onPaginationClick}) => {
    const pageRangeDisplayed = Math.ceil(numOfPageShow / 2);
    const marginPagesDisplayed = Math.ceil(numOfPageShow / 4);

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className={`clearfix ${className ? className : ''}`}>
            <ReactPaginate pageNum={totalPages}
                           pageRangeDisplayed={pageRangeDisplayed}
                           marginPagesDisplayed={marginPagesDisplayed}
                           previousLabel={<i className="material-icons">chevron_left</i>}
                           nextLabel={<i className="material-icons">chevron_right</i>}
                           breakLabel={<span className="break">...</span>}
                           clickCallback={onPaginationClick}
                           containerClassName={"pagination center-align"}
                           subContainerClassName={"pages"}
                           pageClassName={"waves-effect"}
                           activeClassName={"active"}
                           disabledClassName={"disabled"}/>
        </div>
    );
};

Pagination.propTypes = {
    totalPages: React.PropTypes.number,
    numOfPageShow: React.PropTypes.number,
    className: React.PropTypes.string,
    onPaginationClick: React.PropTypes.func
};

Pagination.defaultProps = {
    totalPages: 0,
    numOfPageShow: 10,
    className: null,
    onPaginationClick: null
};

module.exports = Pagination;
