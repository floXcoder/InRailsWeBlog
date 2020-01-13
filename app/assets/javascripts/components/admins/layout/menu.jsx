'use strict';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import DashboardIcon from '@material-ui/icons/Dashboard';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import CommentIcon from '@material-ui/icons/Comment';
import ClassIcon from '@material-ui/icons/Class';
import LabelIcon from '@material-ui/icons/Label';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import ListIcon from '@material-ui/icons/List';
import CachedIcon from '@material-ui/icons/Cached';
import HomeIcon from '@material-ui/icons/Home';
import CancelIcon from '@material-ui/icons/Cancel';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import ListAltIcon from '@material-ui/icons/ListAlt';

function ListItemLink(props) {
    return (
        <ListItem button={true}
                  component="a"
                  {...props}/>
    );
}

function Item({href, text, icon}) {
    return (
        <ListItemLink button={true}
                      href={href}>
            <ListItemIcon>
                {icon}
            </ListItemIcon>

            <ListItemText primary={text}/>
        </ListItemLink>
    );
}

export default class MenuLayout extends React.PureComponent {
    static propTypes = {
        onLogout: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <Item href="/admins"
                      text={I18n.t('js.admin.menu.dashboard')}
                      icon={<DashboardIcon/>}/>

                <Divider/>

                <Item href="/admins/users"
                      text={I18n.t('js.admin.menu.users')}
                      icon={<AccountBoxIcon/>}/>

                <Item href="/admins/comments"
                      text={I18n.t('js.admin.menu.comments')}
                      icon={<CommentIcon/>}/>

                <Divider/>

                <Item href="/admins/topics"
                      text={I18n.t('js.admin.menu.topics')}
                      icon={<ClassIcon/>}/>

                <Item href="/admins/tags"
                      text={I18n.t('js.admin.menu.tags')}
                      icon={<LabelIcon/>}/>

                <Item href="/admins/articles"
                      text={I18n.t('js.admin.menu.articles')}
                      icon={<AssignmentIcon/>}/>

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
                              onClick={this.props.onLogout}>
                    <ListItemIcon>
                        <CancelIcon/>
                    </ListItemIcon>

                    <ListItemText primary={I18n.t('js.admin.menu.log_out')}/>
                </ListItemLink>
            </>
        );
    }
}
