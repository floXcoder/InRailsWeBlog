'use strict';

const HomeTagHeader = ({onTagClick}) => (
    <div className="btn header-button"
         href="#"
         onClick={_handleTagClick.bind(null, onTagClick)}>
        {I18n.t('js.views.header.tags.button')}
    </div>
);

HomeTagHeader.propTypes = {
    onTagClick: PropTypes.func.isRequired
};

const _handleTagClick = (onTagClick, event) => {
    event.preventDefault();

    onTagClick();
};

export default HomeTagHeader;
