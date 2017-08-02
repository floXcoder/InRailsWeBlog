'use strict';

const HomeSearchHeader = ({onSearchClick}) => (
    <div className="btn header-button"
         href="#"
         onClick={_handleSearchClick.bind(null, onSearchClick)}>
        {I18n.t('js.views.header.search.button')}
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
