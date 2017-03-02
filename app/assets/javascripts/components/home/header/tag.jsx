'use strict';

import {FlatButton, FontIcon} from 'material-ui';

const HomeTagHeader = ({onTagClick}) => (
    <FlatButton label={I18n.t('js.header.tags.button')}
                className="header-button"
                secondary={true}
                icon={<FontIcon className="material-icons">local_offer</FontIcon>}
                onTouchTap={(event) => HomeTagHeader._handleTagClick(onTagClick, event)}/>
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
