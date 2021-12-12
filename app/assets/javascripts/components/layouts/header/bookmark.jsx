'use strict';

import IconButton from '@material-ui/core/IconButton';

import FavoriteIcon from '@material-ui/icons/Favorite';

import Dropdown from '../../theme/dropdown';

import BookmarkList from '../../bookmark/list';


export default class HomeBookmarkHeader extends React.PureComponent {
    render() {
        return (
            <Dropdown button={
                <IconButton color="default"
                            itemProp="url">
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
    }
}
