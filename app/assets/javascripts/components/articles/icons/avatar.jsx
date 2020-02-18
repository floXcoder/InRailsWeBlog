'use strict';

import {
    Link
} from 'react-router-dom';

import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import {
    userArticlesPath
} from '../../../constants/routesHelper';

import {
    spyTrackClick
} from '../../../actions';

const ArticleAvatarIcon = ({classes, user, articleDate}) => (
    <div itemScope={true}
         itemProp="author"
         itemType="https://schema.org/Person">
        <ListItem component="div"
                  className={classes.avatarContainer}>
            <ListItemAvatar>
                <Avatar alt={user.pseudo}
                        className={classes.avatar}>
                    <AccountCircleIcon className={classes.avatarIcon}/>
                    {/*<Link to={userArticlesPath(user.slug)}*/}
                    {/*      onClick={spyTrackClick.bind(null, 'user', user.id, user.slug, user.pseudo)}/>*/}
                </Avatar>
            </ListItemAvatar>

            <ListItemText classes={{secondary: classes.avatarDate}}
                          secondary={
                              <time dateTime={articleDate}
                                    itemProp="datePublished">
                                  {articleDate}
                              </time>}>
                <Link className={classes.avatarUser}
                      to={userArticlesPath(user.slug)}
                      itemProp="url"
                      onClick={spyTrackClick.bind(null, 'user', user.id, user.slug, user.pseudo)}>
                    <span itemProp="name">
                        {user.pseudo}
                    </span>
                </Link>
            </ListItemText>
        </ListItem>
    </div>
);

ArticleAvatarIcon.propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    articleDate: PropTypes.string.isRequired
};

export default React.memo(ArticleAvatarIcon);
