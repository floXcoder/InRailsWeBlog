'use strict';

const HomeTagHeader = ({onTagClick}) => (
    <div className="btn header-button"
         href="#"
         onClick={HomeTagHeader._handleTagClick.bind(null, onTagClick)}>
        {I18n.t('js.views.header.tags.button')}
    </div>
);

HomeTagHeader.propTypes = {
    onTagClick: React.PropTypes.func.isRequired
};

HomeTagHeader._handleTagClick = (onTagClick, event) => {
    event.preventDefault();
    onTagClick();
    return false;
};

export default HomeTagHeader;
