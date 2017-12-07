'use strict';

const HomeSearchHeader = ({onSearchClick}) => (
    <div className="btn waves-effect waves-light left header-normal header-button search-header-button"
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
