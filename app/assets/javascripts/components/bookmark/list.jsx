'use strict';

import {
    Fragment
} from 'react';

import {
    Link
} from 'react-router-dom';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import AssignmentIcon from '@mui/icons-material/Assignment';

import {
    userArticlePath
} from '../../constants/routesHelper';

import {
    getBookmarks
} from '../../selectors';


export default @connect((state) => ({
    bookmarks: getBookmarks(state)
}))
class BookmarkList extends React.Component {
    static propTypes = {
        onBookmarkClick: PropTypes.func,
        // from connect
        bookmarks: PropTypes.array
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="bookmark-root">
                <h3 className="bookmark-title">
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
                                                primary: 'bookmark-link'
                                            }}>
                                                {bookmark.name || bookmark.slug}
                                            </ListItemText>
                                        </ListItem>
                                    </Fragment>
                                ))
                            }
                        </List>
                        :
                        <div className="bookmark-none">
                            {I18n.t('js.bookmark.list.none')}
                        </div>
                }
            </div>
        );
    }
}

