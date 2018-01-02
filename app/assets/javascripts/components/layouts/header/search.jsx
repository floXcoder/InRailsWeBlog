'use strict';

const HomeSearchHeader = ({onSearchClick}) => (
    <a id="toggle-search"
       className="btn waves-effect waves-light left header-normal header-button search-header-button"
       onClick={onSearchClick}>
        <span className="material-icons left"
              data-icon="search"
              aria-hidden="true"/>
    </a>
);

HomeSearchHeader.propTypes = {
    onSearchClick: PropTypes.func.isRequired
};

export default HomeSearchHeader;
