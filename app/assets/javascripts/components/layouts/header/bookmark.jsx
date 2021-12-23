'use strict';

import IconButton from '@mui/material/IconButton';

import FavoriteIcon from '@mui/icons-material/Favorite';

import Dropdown from '../../theme/dropdown';

import BookmarkList from '../../bookmark/list';


const HomeBookmarkHeader = function () {
    return (
        <Dropdown button={
            <IconButton color="default" itemProp="url" size="large">
                <FavoriteIcon/>
            </IconButton>
        }
                  position="bottom right"
                  buttonClassName="layout-header-headerButton"
                  isClosingOnInsideClick={true}
                  isFixed={true}
                  hasWavesEffect={false}
                  hasArrow={true}>
            <BookmarkList/>
        </Dropdown>
    );
};

export default React.memo(HomeBookmarkHeader);
