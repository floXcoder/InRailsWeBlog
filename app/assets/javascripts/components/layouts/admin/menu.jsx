'use strict';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import DashboardIcon from '@mui/icons-material/Dashboard';
import CloudCircleIcon from '@mui/icons-material/CloudCircle';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CommentIcon from '@mui/icons-material/Comment';
import ClassIcon from '@mui/icons-material/Class';
import LabelIcon from '@mui/icons-material/Label';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import ListIcon from '@mui/icons-material/List';
import CachedIcon from '@mui/icons-material/Cached';
import HomeIcon from '@mui/icons-material/Home';
import CancelIcon from '@mui/icons-material/Cancel';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import ListAltIcon from '@mui/icons-material/ListAlt';


const ListItemLink = function (props) {
    return (
        <ListItemButton component="a"
                        {...props}/>
    );
};

const Item = function ({
                           href,
                           text,
                           icon
                       }) {
    return (
        <ListItemLink button={true}
                      href={href}>
            <ListItemIcon>
                {icon}
            </ListItemIcon>

            <ListItemText primary={text}/>
        </ListItemLink>
    );
};

Item.propTypes = {
    href: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired
};

const MenuLayout = function ({onLogout}) {
    return (
        <>
            <Item href="/admins"
                  text={I18n.t('js.admin.menu.dashboard')}
                  icon={<DashboardIcon/>}/>

            <Divider/>

            <Item href="/admins/visits"
                  text={I18n.t('js.admin.menu.visits')}
                  icon={<CloudCircleIcon/>}/>

            <Item href="/admins/users"
                  text={I18n.t('js.admin.menu.users')}
                  icon={<AccountBoxIcon/>}/>

            <Item href="/admins/comments"
                  text={I18n.t('js.admin.menu.comments')}
                  icon={<CommentIcon/>}/>

            <Divider/>

            <Item href="/admins/articles"
                  text={I18n.t('js.admin.menu.articles')}
                  icon={<AssignmentIcon/>}/>

            <Item href="/admins/topics"
                  text={I18n.t('js.admin.menu.topics')}
                  icon={<ClassIcon/>}/>

            <Item href="/admins/tags"
                  text={I18n.t('js.admin.menu.tags')}
                  icon={<LabelIcon/>}/>

            <Divider/>

            <Item href="/admins/blogs"
                  text={I18n.t('js.admin.menu.blogs')}
                  icon={<ChromeReaderModeIcon/>}/>

            <Divider/>

            <Item href="/admins/seo"
                  text={I18n.t('js.admin.menu.seo')}
                  icon={<ListAltIcon/>}/>

            <Divider/>

            <Item href="/admins/sidekiq"
                  text={I18n.t('js.admin.menu.jobs')}
                  icon={<SettingsApplicationsIcon/>}/>

            <Item href="/admins/postgres"
                  text={I18n.t('js.admin.menu.postgres')}
                  icon={<AllInboxIcon/>}/>

            <Divider/>

            <Item href="/admins/logs"
                  text={I18n.t('js.admin.menu.logs')}
                  icon={<ListIcon/>}/>

            <Item href="/admins/caches"
                  text={I18n.t('js.admin.menu.cache')}
                  icon={<CachedIcon/>}/>

            <Divider/>

            <Item href="/"
                  text={I18n.t('js.admin.menu.back_home')}
                  icon={<HomeIcon/>}/>

            <ListItemLink button={true}
                          onClick={onLogout}>
                <ListItemIcon>
                    <CancelIcon/>
                </ListItemIcon>

                <ListItemText primary={I18n.t('js.admin.menu.log_out')}/>
            </ListItemLink>
        </>
    );
};

MenuLayout.propTypes = {
    onLogout: PropTypes.func.isRequired
};

export default React.memo(MenuLayout);
