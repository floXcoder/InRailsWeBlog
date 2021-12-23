'use strict';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import CloudCircleIcon from '@mui/icons-material/CloudCircle';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CommentIcon from '@mui/icons-material/Comment';
import LabelIcon from '@mui/icons-material/Label';
import ClassIcon from '@mui/icons-material/Class';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import ListIcon from '@mui/icons-material/List';
import CachedIcon from '@mui/icons-material/Cached';
import ListAltIcon from '@mui/icons-material/ListAlt';

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

Item.propTypes = {
    col: PropTypes.string.isRequired,
    href: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    icon: PropTypes.element
};


const AdminDashboard = () => (
    <div>
        <h1 className="center-align">
            {I18n.t('js.admin.dashboard.title')}
        </h1>

        <div className="row center-align">
            <Item col="s4"
                  href="/admins/visits"
                  text={I18n.t('js.admin.menu.visits')}
                  icon={<CloudCircleIcon/>}/>

            <Item col="s4"
                  href="/admins/users"
                  text={I18n.t('js.admin.menu.users')}
                  icon={<AccountBoxIcon/>}/>

            <Item col="s4"
                  href="/admins/comments"
                  text={I18n.t('js.admin.menu.comments')}
                  icon={<CommentIcon/>}/>

            <Item col="s4"
                  href="/admins/articles"
                  text={I18n.t('js.admin.menu.articles')}
                  icon={<AssignmentIcon/>}/>

            <Item col="s4"
                  href="/admins/tags"
                  text={I18n.t('js.admin.menu.tags')}
                  icon={<LabelIcon/>}/>

            <Item col="s4"
                  href="/admins/topics"
                  text={I18n.t('js.admin.menu.topics')}
                  icon={<ClassIcon/>}/>

            <Item col="s6"
                  href="/admins/blogs"
                  text={I18n.t('js.admin.menu.blogs')}
                  icon={<ChromeReaderModeIcon/>}/>

            <Item col="s6"
                  href="/admins/seo"
                  text={I18n.t('js.admin.menu.seo')}
                  icon={<ListAltIcon/>}/>

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
