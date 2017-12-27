'use strict';

const HomeSearchHeader = ({onSearchClick}) => (
    <div className="btn waves-effect waves-light left header-normal header-button search-header-button"
         onClick={_handleSearchClick.bind(null, onSearchClick)}>
        <span className="material-icons left"
              data-icon="search"
              aria-hidden="true"/>
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
