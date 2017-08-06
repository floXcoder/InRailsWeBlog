'use strict';

const HomeSearchHeader = ({onSearchClick}) => (
    <div className="header-normal header-button left btn waves-effect waves-light search-header-button"
         href="#"
         onClick={_handleSearchClick.bind(null, onSearchClick)}>
        <i className="material-icons left">search</i>
    </div>
);

HomeSearchHeader.propTypes = {
    onSearchClick: PropTypes.func.isRequired
};

const _handleSearchClick = (onSearchClick, event) => {
    event.preventDefault();

    onSearchClick();
};

export default HomeSearchHeader;
