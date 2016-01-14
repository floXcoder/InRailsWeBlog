'use strict';

var ReactPaginate = require('react-paginate');

var Pagination = React.createClass({
    propTypes: {
        totalPages: React.PropTypes.number.isRequired,
        onPageClick: React.PropTypes.func.isRequired,
        numOfPageShow: React.PropTypes.number.isRequired

    },

    getDefaultProps () {
        return {
            numOfPageShow: 10
        };
    },

    render () {
        let pageRangeDisplayed = Math.ceil(this.props.numOfPageShow / 2);
        let marginPagesDisplayed = Math.ceil(this.props.numOfPageShow / 4);

        return (
            <ReactPaginate pageNum={this.props.totalPages}
                           pageRangeDisplayed={pageRangeDisplayed}
                           marginPagesDisplayed={marginPagesDisplayed}
                           previousLabel={<i className="material-icons">chevron_left</i>}
                           nextLabel={<i className="material-icons">chevron_right</i>}
                           breakLabel={<li className="break">...</li>}
                           clickCallback={this.props.onPageClick}
                           containerClassName={"pagination center-align"}
                           subContainerClassName={"pages"}
                           pageClassName={"waves-effect"}
                           activeClassName={"active"}
                           disabledClassName={"disabled"}/>
        );
    }
});

module.exports = Pagination;

