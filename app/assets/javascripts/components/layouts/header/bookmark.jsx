'use strict';

import {
    withStyles
} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

import FavoriteIcon from '@material-ui/icons/Favorite';

import Dropdown from '../../theme/dropdown';

import BookmarkList from '../../bookmark/list';

import styles from '../../../../jss/user/header';

export default @withStyles(styles)
class HomeBookmarkHeader extends React.PureComponent {
    static propTypes = {
        // from styles
        classes: PropTypes.object
    };

    render() {
        return (
            <Dropdown button={
                <IconButton color="primary">
                    <FavoriteIcon/>
                </IconButton>
            }
                      position="bottom right"
                      buttonClassName={this.props.classes.headerButton}
                      isClosingOnInsideClick={true}
                      isFixed={true}
                      hasWavesEffect={false}
                      hasArrow={true}>
                <BookmarkList/>
            </Dropdown>
        );
    }
}
