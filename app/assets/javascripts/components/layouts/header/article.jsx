'use strict';

import {Link} from 'react-router-dom';

// TODO : replace by dropdown
const HomeArticleHeader = ({}) => {
    if ($app.isUserConnected()) {
        return (
            <IconMenu
                anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                iconButtonElement={
                    <FlatButton label={I18n.t('js.views.header.articles.button')}
                                className="header-button"
                                secondary={true}
                                icon={<FontIcon className="material-icons">message</FontIcon>}/>
                }>
                <MenuItem primaryText={
                    <Link to={`/article/user/${$app.user.currentId}`}
                          activeClassName="link-active">
                        {I18n.t('js.views.header.articles.menu.user')}
                    </Link>
                }/>

                <Divider />

                <MenuItem primaryText={
                    <Link to="/article/new"
                          activeClassName="link-active">
                        {I18n.t('js.views.header.articles.menu.new')}
                    </Link>
                }/>
                <MenuItem primaryText={
                    <Link to={`/article/user/${$app.user.currentId}/bookmark`}
                          activeClassName="link-active">
                        {I18n.t('js.views.header.articles.menu.bookmark')}
                    </Link>
                }/>

                <Divider />

                <MenuItem primaryText={
                    <Link to={`/article/user/${$app.user.currentId}/draft`}
                          activeClassName="link-active">
                        {I18n.t('js.views.header.articles.menu.draft')}
                    </Link>
                }
                          rightIcon={<Badge badgeContent={$app.isUserLoaded().draft_count} secondary={true}/>}/>
            </IconMenu>
        );
    } else {
        return null;
    }
};

export default HomeArticleHeader;
