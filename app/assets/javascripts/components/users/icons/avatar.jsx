'use strict';

import {
    Link
} from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid2';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import {
    userArticlesPath
} from '../../../constants/routesHelper';

import {
    spyTrackClick
} from '../../../actions';


function UserAvatarIcon({
                            className,
                            user,
                            secondary
                        }) {
    return (
        <Link className={className}
              to={userArticlesPath(user.slug)}
              onClick={spyTrackClick.bind(null, 'user', user.id, user.slug, null, user.pseudo, null)}>
            <Grid container={true}
                  spacing={2}
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center">
                <Grid >
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

                <Grid >
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
}

UserAvatarIcon.propTypes = {
    user: PropTypes.object.isRequired,
    className: PropTypes.string,
    secondary: PropTypes.element
};

export default React.memo(UserAvatarIcon);
