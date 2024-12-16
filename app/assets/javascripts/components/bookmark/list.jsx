import React, {
    Fragment
} from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import {
    Link
} from 'react-router';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import AssignmentIcon from '@mui/icons-material/Assignment';

import I18n from '@js/modules/translations';

import {
    userArticlePath
} from '@js/constants/routesHelper';


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
                                        <ListItemButton component={Link}
                                                        to={userArticlePath(bookmark.parentSlug, bookmark.slug)}
                                                        onClick={this.props.onBookmarkClick}>
                                            <ListItemIcon>
                                                <AssignmentIcon fontSize="small"/>
                                            </ListItemIcon>

                                            <ListItemText classes={{
                                                primary: 'bookmark-link'
                                            }}>
                                                {bookmark.name || bookmark.slug}
                                            </ListItemText>
                                        </ListItemButton>
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

export default connect((state) => ({
    bookmarks: state.bookmarkState.bookmarks
}))(BookmarkList)