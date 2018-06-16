'use strict';

import {
    Link
} from 'react-router-dom';

import Dropdown from '../../theme/dropdown';

import BookmarkList from '../../bookmark/list';

const HomeBookmarkHeader = () => {
    return (
        <Dropdown button={
                <span className="material-icons left"
                      data-icon="favorite"
                      aria-hidden="true">
                </span>
            }
                  position="bottom right"
                  buttonClassName="header-button"
                  isClosingOnInsideClick={true}
                  isFloatingButton={true}
                  isFixed={true}
                  hasWavesEffect={false}
                  hasArrow={true}>
            <BookmarkList/>
        </Dropdown>
    );
};

export default HomeBookmarkHeader;
