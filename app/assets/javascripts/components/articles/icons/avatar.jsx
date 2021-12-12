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

const ArticleAvatarIcon = function ({user, articleDate}) {
    return (
        <div itemScope={true}
             itemProp="author"
             itemType="https://schema.org/Person">
            <ListItem component="div"
                      className="article-card-avatarContainer">
                <ListItemAvatar>
                    <Avatar alt={user.pseudo}
                            className="article-card-avatar">
                        <AccountCircleIcon className="article-card-avatarIcon"/>
                        {/*<Link to={userArticlesPath(user.slug)}*/}
                        {/*      onClick={spyTrackClick.bind(null, 'user', user.id, user.slug, null, user.pseudo, null)}/>*/}
                    </Avatar>
                </ListItemAvatar>

                <ListItemText classes={{secondary: 'article-card-avatarDate'}}
                              secondary={
                                  <time dateTime={articleDate}
                                        itemProp="datePublished">
                                      {articleDate}
                                  </time>
                              }>
                    <Link className="article-card-avatarUser"
                          to={userArticlesPath(user.slug)}
                          itemProp="url"
                          onClick={spyTrackClick.bind(null, 'user', user.id, user.slug, null, user.pseudo, null)}>
                    <span itemProp="name">
                        {user.pseudo}
                    </span>
                    </Link>
                </ListItemText>
            </ListItem>
        </div>
    );
};

ArticleAvatarIcon.propTypes = {
    user: PropTypes.object.isRequired,
    articleDate: PropTypes.string.isRequired
};

export default React.memo(ArticleAvatarIcon);
