'use strict';

const HomeSearchHeader = ({onSearchClick}) => (
    <div className="btn header-button"
         href="#"
         onClick={HomeSearchHeader._handleSearchClick.bind(null, onSearchClick)}>
        {I18n.t('js.views.header.search.button')}
    </div>
);

HomeSearchHeader.propTypes = {
    onSearchClick: React.PropTypes.func.isRequired
};

HomeSearchHeader._handleSearchClick = (onSearchClick, event) => {
    event.preventDefault();
    onSearchClick();
    return false;
};

export default HomeSearchHeader;
