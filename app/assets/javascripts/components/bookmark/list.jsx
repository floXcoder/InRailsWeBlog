'use strict';

import {
    Fragment
} from 'react';

import {
    Link
} from 'react-router-dom';

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

