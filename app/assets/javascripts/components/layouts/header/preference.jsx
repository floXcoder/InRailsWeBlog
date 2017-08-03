'use strict';

const HomePreferenceHeader = ({onPreferenceClick}) => (
    <div className="btn header-button"
         href="#"
         onClick={_handlePreferenceClick.bind(null, onPreferenceClick)}>
        {I18n.t('js.views.header.settings.button')}
    </div>
);

HomePreferenceHeader.propTypes = {
    onPreferenceClick: PropTypes.func.isRequired
};

const _handlePreferenceClick = (onPreferenceClick, event) => {
    event.preventDefault();

    onPreferenceClick();
};

export default HomePreferenceHeader;
