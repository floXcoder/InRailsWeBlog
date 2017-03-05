'use strict';

const HomePreferenceHeader = ({onPreferenceClick}) => (
    <div className="btn header-button"
         href="#"
         onClick={HomePreferenceHeader._handlePreferenceClick.bind(null, onPreferenceClick)}>
        {I18n.t('js.views.header.settings.button')}
    </div>
);

HomePreferenceHeader.propTypes = {
    onPreferenceClick: React.PropTypes.func.isRequired
};

HomePreferenceHeader._handlePreferenceClick = (onPreferenceClick, event) => {
    event.preventDefault();
    onPreferenceClick();
    return false;
};

export default HomePreferenceHeader;
