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

    render() {
        return (
            <div className={this.props.classes.root}>
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
                                                  to={`/users/${bookmark.parentSlug}/articles/${bookmark.slug}`}>
                                            <ListItemText classes={{
                                                primary: this.props.classes.link
                                            }}>
                                                {bookmark.name || bookmark.slug}
                                            </ListItemText>
                                        </ListItem>
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
        );
    }
}

