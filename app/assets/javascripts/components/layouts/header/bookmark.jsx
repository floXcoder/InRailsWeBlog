import React from 'react';

import IconButton from '@mui/material/IconButton';

import FavoriteIcon from '@mui/icons-material/Favorite';

import Dropdown from '@js/components/theme/dropdown';

import BookmarkList from '@js/components/bookmark/list';


const HomeBookmarkHeader = function () {
    return (
        <Dropdown id="header-bookmark"
                  buttonClassName="layout-header-headerButton"
                  button={
                      <IconButton color="default"
                                  itemProp="url"
                                  size="large">
                          <FavoriteIcon/>
                      </IconButton>
                  }>
            <BookmarkList/>
        </Dropdown>
    );
};

export default React.memo(HomeBookmarkHeader);
