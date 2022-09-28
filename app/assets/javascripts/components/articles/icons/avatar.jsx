'use strict';

import {
    Link
} from 'react-router-dom';

import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import {
    userArticlesPath
} from '../../../constants/routesHelper';

import {
    spyTrackClick
} from '../../../actions';


const ArticleAvatarIcon = function ({
                                        user,
                                        createdDate,
                                        updatedDate
                                    }) {
    return (
        <div itemScope={true}
             itemProp="author"
             itemType="https://schema.org/Person">
            <ListItem component="div"
                      className="article-card-avatar-container">
                <ListItemAvatar>
                    <Avatar alt={user.pseudo}
                            className="article-card-avatar">
                        <AccountCircleIcon className="article-card-avatar-icon"/>
                        {/*<Link to={userArticlesPath(user.slug)}*/}
                        {/*      onClick={spyTrackClick.bind(null, 'user', user.id, user.slug, null, user.pseudo, null)}/>*/}
                    </Avatar>
                </ListItemAvatar>

                <ListItemText classes={{secondary: 'article-card-avatar-date'}}
                              secondary={
                                  <>
                                      <time className="flow-tooltip-bottom"
                                            dateTime={createdDate}
                                            itemProp="datePublished"
                                            data-tooltip={I18n.t('js.article.tooltip.created')}>
                                          {createdDate}
                                      </time>

                                      <span className="article-card-avatar-date-secondary">
                                          (
                                          <time className="flow-tooltip-bottom"
                                                dateTime={updatedDate}
                                                itemProp="dateCreated"
                                                data-tooltip={I18n.t('js.article.tooltip.updated')}>
                                              {updatedDate}
                                          </time>
                                          )
                                      </span>
                                  </>
                              }>
                    <Link className="article-card-avatar-user"
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
    createdDate: PropTypes.string.isRequired,
    updatedDate: PropTypes.string.isRequired
};

export default React.memo(ArticleAvatarIcon);
