'use strict';

import {
    Link
} from 'react-router-dom';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import {
    spyTrackClick
} from '../../../actions';

const ArticleAvatarIcon = ({classes, user, articleDate}) => (
    <div itemScope={true}
         itemType="https://schema.org/Person">
        <ListItem component="div"
                  className={classes.avatarContainer}>
            <Avatar alt={user.pseudo}
                    className={classes.avatar}>
                <AccountCircleIcon className={classes.avatarIcon}/>
                {/*<Link to={`/users/${user.slug}`}*/}
                {/*onClick={spyTrackClick.bind(null, 'user', user.id, user.slug, user.pseudo)}>*/}
                {/**/}
                {/*</Link>*/}
            </Avatar>

            <ListItemText classes={{secondary: classes.avatarDate}}
                          secondary={articleDate}>
                <Link className={classes.avatarUser}
                      to={`/users/${user.slug}`}
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

export default ArticleAvatarIcon;
