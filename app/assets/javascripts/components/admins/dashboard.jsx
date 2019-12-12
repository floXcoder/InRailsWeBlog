'use strict';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import AccountBoxIcon from '@material-ui/icons/AccountBox';
import CommentIcon from '@material-ui/icons/Comment';
import LabelIcon from '@material-ui/icons/Label';
import ClassIcon from '@material-ui/icons/Class';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import ListIcon from '@material-ui/icons/List';
import CachedIcon from '@material-ui/icons/Cached';

function Item({col, href, text, icon}) {
    return (
        <div className={`col ${col}`}>
            <Paper elevation={1}
                   style={{margin: '1rem', padding: '1rem'}}>
                <Typography variant="h5"
                            component="h3">
                    {text}
                </Typography>

                <Typography className="margin-top-20"
                            component="p">
                    <Button color="primary"
                            variant="outlined"
                            href={href}>
                        {icon}
                        <span style={{paddingLeft: '.6rem'}}>{I18n.t('js.admin.dashboard.button')}</span>
                    </Button>
                </Typography>
            </Paper>
        </div>
    );
}

const AdminDashboard = () => (
    <div>
        <h1 className="center-align">
            {I18n.t('js.admin.dashboard.title')}
        </h1>

        <div className="row center-align">
            <Item col="s6"
                  href="/admins/users"
                  text={I18n.t('js.admin.menu.users')}
                  icon={<AccountBoxIcon/>}/>

            <Item col="s6"
                  href="/admins/comments"
                  text={I18n.t('js.admin.menu.comments')}
                  icon={<CommentIcon/>}/>

            <Item col="s4"
                  href="/admins/tags"
                  text={I18n.t('js.admin.menu.tags')}
                  icon={<LabelIcon/>}/>

            <Item col="s4"
                  href="/admins/topics"
                  text={I18n.t('js.admin.menu.topics')}
                  icon={<ClassIcon/>}/>

            <Item col="s4"
                  href="/admins/articles"
                  text={I18n.t('js.admin.menu.articles')}
                  icon={<AssignmentIcon/>}/>

            <Item col="s12"
                  href="/admins/blogs"
                  text={I18n.t('js.admin.menu.blogs')}
                  icon={<ChromeReaderModeIcon/>}/>

            <Item col="s4"
                  href="/admins/sidekiq"
                  text={I18n.t('js.admin.menu.jobs')}
                  icon={<SettingsApplicationsIcon/>}/>

            <Item col="s4"
                  href="/admins/logs"
                  text={I18n.t('js.admin.menu.logs')}
                  icon={<ListIcon/>}/>

            <Item col="s4"
                  href="/admins/caches"
                  text={I18n.t('js.admin.menu.cache')}
                  icon={<CachedIcon/>}/>
        </div>
    </div>
);

export default React.memo(AdminDashboard);
