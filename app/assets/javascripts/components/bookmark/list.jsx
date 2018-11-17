'use strict';

import {
    Link
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

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
        // from connect
        bookmarks: PropTypes.array,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // Loaded by user manager
        // this.props.fetchBookmarks();
    }

    render() {
        return (
            <div className={this.props.classes.root}>
                <div>
                    <h3 className={this.props.classes.title}>
                        {I18n.t('js.bookmark.list.title')}
                    </h3>

                    {
                        this.props.bookmarks.length > 0
                            ?
                            <List component="div">
                                {
                                    this.props.bookmarks.map((bookmark, i) => (
                                        <React.Fragment key={i}>
                                            <ListItem button={true}
                                                      component={Link}
                                                      className={this.props.classes.link}
                                                      to={`/users/${bookmark.parentSlug}/articles/${bookmark.slug}`}>
                                                {/*<ListItemIcon>*/}
                                                {/*<InboxIcon />*/}
                                                {/*</ListItemIcon>*/}

                                                <ListItemText>
                                                    {bookmark.name || bookmark.slug}
                                                </ListItemText>
                                            </ListItem>

                                            {
                                                (this.props.bookmarks.length > 1 && i < this.props.bookmarks.length - 1) &&
                                                <Divider/>
                                            }
                                        </React.Fragment>
                                    ))
                                }
                            </List>
                            :
                            <div className={this.props.classes.none}>
                                {I18n.t('js.bookmark.list.none')}
                            </div>
                    }
                </div>
            </div>
        );
    }
}

