'use strict';

import IconButton from '@material-ui/core/IconButton';

import FavoriteIcon from '@material-ui/icons/Favorite';

import Dropdown from '../../theme/dropdown';

import BookmarkList from '../../bookmark/list';

const HomeBookmarkHeader = () => {
    return (
        <Dropdown button={
            <IconButton color="primary">
                <FavoriteIcon/>
            </IconButton>
        }
                  buttonClassName="header-button"
                  isClosingOnInsideClick={true}
                  isFixed={true}
                  hasWavesEffect={false}
                  hasArrow={true}>
            <BookmarkList/>
        </Dropdown>
    );
};

export default HomeBookmarkHeader;
