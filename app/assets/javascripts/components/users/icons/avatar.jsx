'use strict';

import {
    Link
} from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import {
    userArticlesPath
} from '../../../constants/routesHelper';

import {
    spyTrackClick
} from '../../../actions';

const UserAvatarIcon = ({className, user, secondary}) => (
    <Link className={className}
          to={userArticlesPath(user.slug)}
          onClick={spyTrackClick.bind(null, 'user', user.id, user.slug, null, user.pseudo, null)}>
        <Grid container={true}
              spacing={2}
              direction="row"
              justify="flex-start"
              alignItems="center">
            <Grid item={true}>
                {
                    user.avatar
                        ?
                        <Avatar alt={user.pseudo}
                                src={user.avatar}/>
                        :
                        <Avatar>
                            <AccountCircleIcon/>
                        </Avatar>
                }
            </Grid>

            <Grid item={true}>
                <span style={{display: 'block'}}>
                    {user.pseudo}
                </span>

                <span style={{display: 'block'}}>
                    {secondary}
                </span>
            </Grid>
        </Grid>
    </Link>
);

UserAvatarIcon.propTypes = {
    user: PropTypes.object.isRequired,
    className: PropTypes.string,
    secondary: PropTypes.element
};

export default React.memo(UserAvatarIcon);
