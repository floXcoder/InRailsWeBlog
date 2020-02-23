'use strict';

import {
    Fragment
} from 'react';

import {
    Link
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import AssignmentIcon from '@material-ui/icons/Assignment';

import {
    userArticlePath
} from '../../constants/routesHelper';

import {
    getBookmarks
} from '../../selectors';

import styles from '../../../jss/user/bookmark';

export default @connect((state) => ({
    bookmarks: getBookmarks(state)
}))
@withStyles(styles)
class BookmarkList extends React.Component {
    static propTypes = {
        onBookmarkClick: PropTypes.func,
        // from connect
        bookmarks: PropTypes.array,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.classes.root}>
                <h3 className={this.props.classes.title}>
                    {I18n.t('js.bookmark.list.title')}
                </h3>

                {
                    this.props.bookmarks.length > 0
                        ?
                        <List component="div"
                              dense={true}>
                            {
                                this.props.bookmarks.map((bookmark, i) => (
                                    <Fragment key={i}>
                                        <ListItem button={true}
                                                  component={Link}
                                                  to={userArticlePath(bookmark.parentSlug, bookmark.slug)}
                                                  onClick={this.props.onBookmarkClick}>
                                            <ListItemIcon>
                                                <AssignmentIcon/>
                                            </ListItemIcon>

                                            <ListItemText classes={{
                                                primary: this.props.classes.link
                                            }}>
                                                {bookmark.name || bookmark.slug}
                                            </ListItemText>
                                        </ListItem>
                                    </Fragment>
                                ))
                            }
                        </List>
                        :
                        <div className={this.props.classes.none}>
                            {I18n.t('js.bookmark.list.none')}
                        </div>
                }
            </div>
        );
    }
}

