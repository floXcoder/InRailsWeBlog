'use strict';

import {Link} from 'react-router';

import {IconMenu, MenuItem, FlatButton, Badge, FontIcon, Divider} from 'material-ui';

var HomeArticleHeader = ({}) => {
    if ($app.user.isConnected()) {
        return (
            <IconMenu
                anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                iconButtonElement={
                    <FlatButton label={I18n.t('js.header.articles.button')}
                                className="header-button"
                                secondary={true}
                                icon={<FontIcon className="material-icons">message</FontIcon>}/>
                }>
                <MenuItem primaryText={
                            <Link to={`/article/user/${$app.user.current.id}`}
                                  activeClassName="link-active">
                                {I18n.t('js.header.articles.menu.user')}
                            </Link>
                          }/>

                <Divider />

                <MenuItem primaryText={
                            <Link to="/article/new"
                                  activeClassName="link-active">
                                {I18n.t('js.header.articles.menu.new')}
                            </Link>
                          }/>
                <MenuItem primaryText={
                            <Link to={`/article/user/${$app.user.current.id}/bookmark`}
                                  activeClassName="link-active">
                                {I18n.t('js.header.articles.menu.bookmark')}
                            </Link>
                          }/>

                <Divider />

                <MenuItem primaryText={
                            <Link to={`/article/user/${$app.user.current.id}/temporary`}
                                  activeClassName="link-active">
                                {I18n.t('js.header.articles.menu.temporary')}
                            </Link>
                          }
                          rightIcon={<Badge badgeContent={$app.user.current.temporary_count} secondary={true}/>}/>
            </IconMenu>
        );
    } else {
        return null;
    }
};

module.exports = HomeArticleHeader;
