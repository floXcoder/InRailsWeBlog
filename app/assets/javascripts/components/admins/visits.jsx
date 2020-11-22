'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
    withStyles
} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import LabelIcon from '@material-ui/icons/Label';
import ClassIcon from '@material-ui/icons/Class';
import AssignmentIcon from '@material-ui/icons/Assignment';

import {
    fetchVisits
} from '../../actions/admin';

import Loader from '../theme/loader';
import MiniCard from '../material-ui/miniCard';

import styles from '../../../jss/admin/visits';
import Divider from "@material-ui/core/Divider";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

export default @connect((state) => ({
    visits: state.adminState.visits,
    isFetching: state.adminState.isFetching
}), {
    fetchVisits
})
@hot
@withStyles(styles)
class AdminVisits extends React.Component {
    static propTypes = {
        // from connect
        isFetching: PropTypes.bool,
        visits: PropTypes.object,
        fetchVisits: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchVisits();
    }

    _renderListDetails = (listDetails) => {
        if (!listDetails) {
            return (
                <div className="margin-top-30">
                    <p className={this.props.classes.listItem}>
                        <em>{I18n.t('js.article.tracking.undefined')}</em>
                    </p>
                </div>
            );
        }

        return (
            <List className={this.props.classes.listContainer}
                  dense={true}>
                {
                    Object.entries(listDetails).map(([element, count], i) => (
                        <ListItem key={i}>
                            <ListItemText className={this.props.classes.listItem}
                                          primary={
                                              <div>
                                                  {
                                                      (!element || element === 'internal' || element === 'others') &&
                                                      <Divider className="margin-top-5 margin-bottom-20"/>
                                                  }

                                                  {
                                                      !element &&
                                                      <em>{I18n.t('js.article.tracking.undefined')}</em>
                                                  }

                                                  {
                                                      element === 'others' &&
                                                      <em>{I18n.t('js.article.tracking.others')}</em>
                                                  }

                                                  {
                                                      element === 'internal' &&
                                                      <em>{I18n.t('js.article.tracking.internal')}</em>
                                                  }

                                                  {
                                                      (element !== 'others' && element !== 'internal') &&
                                                      element
                                                  }
                                              </div>
                                          }/>

                            <ListItemSecondaryAction
                                className={classNames(this.props.classes.listItem, {
                                    'margin-top-10': (!element || element === 'internal' || element === 'others')
                                })}>
                                {count}
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))
                }
            </List>
        );
    }

    _renderVisits = () => {
        let totalByDate = 0;

        return (
            <div className="row margin-top-30 margin-bottom-40">
                <div className="col s12">
                    <h2 className={this.props.classes.title}>
                        {I18n.t('js.admin.visits.uniq.title')}
                    </h2>

                    <TableContainer component={Paper}>
                        <Table aria-label="visits by days">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="left">
                                        {I18n.t('js.admin.visits.uniq.data')}
                                    </TableCell>

                                    {
                                        Object.keys(this.props.visits.dates).map((date) => (
                                            <TableCell key={date}
                                                       align="center">
                                                {date}
                                            </TableCell>
                                        ))
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="left">
                                        {I18n.t('js.admin.visits.uniq.day')}
                                    </TableCell>

                                    {
                                        Object.values(this.props.visits.dates).map((count, i) => (
                                            <TableCell key={i}
                                                       align="center">
                                                {count}
                                            </TableCell>
                                        ))
                                    }
                                </TableRow>

                                <TableRow>
                                    <TableCell align="left">
                                        {I18n.t('js.admin.visits.uniq.total')}
                                    </TableCell>

                                    {
                                        Object.values(this.props.visits.dates).map((count, i) => {
                                            totalByDate += count;

                                            return (
                                                <TableCell key={i}
                                                           align="center">
                                                    {totalByDate}
                                                </TableCell>
                                            );
                                        })
                                    }
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                <div className="col s12 margin-top-40">
                    <h2 className={this.props.classes.title}>
                        {I18n.t('js.admin.visits.stats.title')}
                    </h2>

                    <Grid container={true}
                          className={this.props.classes.gridContainer}
                          spacing={2}
                          direction="row"
                          justify="space-around"
                          alignItems="center">
                        <Grid item={true}>
                            <MiniCard title={I18n.t('js.admin.visits.stats.uniq')}
                                      number={this.props.visits.totalUniqVisits}/>
                        </Grid>

                        <Grid item={true}>
                            <MiniCard title={I18n.t('js.admin.visits.stats.clicks')}
                                      number={this.props.visits.totalClicks}/>
                        </Grid>

                        <Grid item={true}>
                            <MiniCard title={I18n.t('js.admin.visits.stats.views')}
                                      number={this.props.visits.totalViews}/>
                        </Grid>

                        <Grid item={true}>
                            <MiniCard title={I18n.t('js.admin.visits.stats.searches')}
                                      number={this.props.visits.totalSearches}/>
                        </Grid>
                    </Grid>

                    <Grid container={true}
                          className={this.props.classes.gridContainer}
                          spacing={2}
                          direction="row"
                          justify="space-around"
                          alignItems="center">
                        <Grid item={true}>
                            <MiniCard title={I18n.t('js.admin.visits.stats.pages')}
                                      number={this.props.visits.averagePages}/>
                        </Grid>

                        <Grid item={true}>
                            <MiniCard title={I18n.t('js.admin.visits.stats.bounce')}
                                      number={this.props.visits.bounceRate + '%'}/>
                        </Grid>

                        <Grid item={true}>
                            <MiniCard title={I18n.t('js.admin.visits.stats.duration')}
                                      number={this.props.visits.duration}/>
                        </Grid>
                    </Grid>
                </div>

                <div className="col s12 margin-top-40">
                    <h2 className={this.props.classes.title}>
                        {I18n.t('js.admin.visits.tops.title')}
                    </h2>

                    <Grid container={true}
                          className={this.props.classes.gridContainer}
                          spacing={2}
                          direction="row"
                          justify="space-around"
                          alignItems="center">
                        <Grid item={true}>
                            <MiniCard title={I18n.t('js.admin.visits.tops.total_articles')}
                                      number={this.props.visits.totalArticles}/>
                        </Grid>

                        <Grid item={true}>
                            <MiniCard title={I18n.t('js.admin.visits.tops.total_tags')}
                                      number={this.props.visits.totalTags}/>
                        </Grid>

                        <Grid item={true}>
                            <MiniCard title={I18n.t('js.admin.visits.tops.total_topics')}
                                      number={this.props.visits.totalTopics}/>
                        </Grid>
                    </Grid>

                    <Grid container={true}
                          className={this.props.classes.gridContainer}
                          spacing={2}
                          direction="row"
                          justify="space-between"
                          alignItems="flex-start">
                        <Grid item={true}>
                            <List className={this.props.classes.listContainer}>
                                {
                                    this.props.visits.topArticles.map((article) => (
                                        <ListItem key={article.name}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <AssignmentIcon/>
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText classes={{
                                                primary: this.props.classes.listItem,
                                                secondary: this.props.classes.listItemSecondary
                                            }}
                                                          primary={article.name}
                                                          secondary={`${article.count} (${article.date})`}/>
                                        </ListItem>
                                    ))
                                }
                            </List>
                        </Grid>

                        <Grid item={true}>
                            <List className={this.props.classes.listContainer}>
                                {
                                    this.props.visits.topTags.map((tag) => (
                                        <ListItem key={tag.name}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <LabelIcon/>
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText classes={{
                                                primary: this.props.classes.listItem,
                                                secondary: this.props.classes.listItemSecondary
                                            }}
                                                          primary={tag.name}
                                                          secondary={tag.count}/>
                                        </ListItem>
                                    ))
                                }
                            </List>
                        </Grid>

                        <Grid item={true}>
                            <List className={this.props.classes.listContainer}>
                                {
                                    this.props.visits.topTopics.map((topic) => (
                                        <ListItem key={topic.name}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <ClassIcon/>
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText classes={{
                                                primary: this.props.classes.listItem,
                                                secondary: this.props.classes.listItemSecondary
                                            }}
                                                          primary={topic.name}
                                                          secondary={topic.count}/>
                                        </ListItem>
                                    ))
                                }
                            </List>
                        </Grid>
                    </Grid>
                </div>

                <div className="col s12 margin-top-40">
                    <h2 className={this.props.classes.title}>
                        {I18n.t('js.admin.visits.sources.title')}
                    </h2>

                    <div className="row">
                        <div className="col s12 m4">
                            <h3 className={this.props.classes.subtitle}>
                                {I18n.t('js.article.tracking.origins.referer')}
                            </h3>

                            {this._renderListDetails(this.props.visits.referers)}
                        </div>

                        <div className="col s12 m4">
                            <h3 className={this.props.classes.subtitle}>
                                {I18n.t('js.article.tracking.origins.country')}
                            </h3>

                            {this._renderListDetails(this.props.visits.countries)}
                        </div>

                        <div className="col s12 m4">
                            <h3 className={this.props.classes.subtitle}>
                                {I18n.t('js.article.tracking.origins.utm')}
                            </h3>

                            {this._renderListDetails(this.props.visits.utmSources)}
                        </div>
                    </div>

                    <div className="row margin-top-50">
                        <div className="col s12 m4">
                            <h3 className={this.props.classes.subtitle}>
                                {I18n.t('js.article.tracking.origins.os')}
                            </h3>

                            {this._renderListDetails(this.props.visits.os)}
                        </div>

                        <div className="col s12 m4">
                            <h3 className={this.props.classes.subtitle}>
                                {I18n.t('js.article.tracking.origins.device')}
                            </h3>

                            {this._renderListDetails(this.props.visits.devices)}
                        </div>

                        <div className="col s12 m4">
                            <h3 className={this.props.classes.subtitle}>
                                {I18n.t('js.article.tracking.origins.browser')}
                            </h3>

                            {this._renderListDetails(this.props.visits.browsers)}
                        </div>
                    </div>
                </div>
            </div>
        )
    };

    render() {
        return (
            <div>
                <h1 className="center-align">
                    {I18n.t('js.admin.visits.title')}
                </h1>

                {
                    (Object.keys(this.props.visits).length === 0 || this.props.isFetching)
                        ?
                        <div className="center">
                            <Loader size="big"/>
                        </div>
                        :
                        this._renderVisits()
                }
            </div>
        );
    }
}
