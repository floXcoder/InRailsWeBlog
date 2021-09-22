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
import Divider from '@material-ui/core/Divider';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import LabelIcon from '@material-ui/icons/Label';
import ClassIcon from '@material-ui/icons/Class';
import AssignmentIcon from '@material-ui/icons/Assignment';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import {
    fetchVisits
} from '../../actions/admin';

import Loader from '../theme/loader';
import MiniCard from '../material-ui/miniCard';

import TrackingArticleModal from '../articles/tracking';
import TrackingVisitModal from '../visits/tracking';

import styles from '../../../jss/admin/visits';

export default @connect((state) => ({
    visitsStats: state.adminState.visitsStats,
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
        visitsStats: PropTypes.object,
        fetchVisits: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    state = {
        articleIdStats: undefined,
        visitsDate: undefined
    }

    componentDidMount() {
        this.props.fetchVisits();
    }

    _handleShowArticleStats = (articleId, event) => {
        event.preventDefault();

        this.setState({
            articleIdStats: articleId
        });
    };

    _handleArticleModalClose = () => {
        this.setState({
            articleIdStats: undefined
        });
    };

    _handleShowVisitsDate = (date, event) => {
        event.preventDefault();

        this.setState({
            visitsDate: date
        });
    };

    _handleVisitModalClose = () => {
        this.setState({
            visitsDate: undefined
        });
    };

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
    };

    _renderVisits = () => {
        // let totalByDate = 0;

        return (
            <div className="row margin-top-30 margin-bottom-40">
                <div className="col s12">
                    <h2 className={this.props.classes.title}>
                        {I18n.t('js.admin.visits.uniq.title')}
                    </h2>

                    <TableContainer component={Paper}
                                    className={this.props.classes.tableContainer}>
                        <Table aria-label="visits by days">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={this.props.classes.tableData}
                                               align="left">
                                        {I18n.t('js.admin.visits.uniq.data')}
                                    </TableCell>

                                    {
                                        Object.keys(this.props.visitsStats.dates).map((date) => (
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
                                    <TableCell className={this.props.classes.tableData}
                                               align="left">
                                        {I18n.t('js.admin.visits.uniq.day')}
                                    </TableCell>

                                    {
                                        Object.entries(this.props.visitsStats.dates).map(([date, count], i) => (
                                            <TableCell key={i}
                                                       align="center">
                                                <a className={this.props.classes.tableDataItem}
                                                   href="#"
                                                   onClick={this._handleShowVisitsDate.bind(this, date)}>
                                                    {count}
                                                </a>
                                            </TableCell>
                                        ))
                                    }
                                </TableRow>

                                {/*<TableRow>*/}
                                {/*    <TableCell className={this.props.classes.tableData}*/}
                                {/*               align="left">*/}
                                {/*        {I18n.t('js.admin.visits.uniq.total')}*/}
                                {/*    </TableCell>*/}

                                {/*    {*/}
                                {/*        Object.values(this.props.visitsStats.dates).map((count, i) => {*/}
                                {/*            totalByDate += count;*/}

                                {/*            return (*/}
                                {/*                <TableCell key={i}*/}
                                {/*                           align="center">*/}
                                {/*                    {totalByDate}*/}
                                {/*                </TableCell>*/}
                                {/*            );*/}
                                {/*        })*/}
                                {/*    }*/}
                                {/*</TableRow>*/}
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
                          justifyContent="space-around"
                          alignItems="center">
                        <Grid item={true}>
                            <MiniCard title={I18n.t('js.admin.visits.stats.visits')}
                                      number={this.props.visitsStats.totalUniqVisits}/>
                        </Grid>

                        <Grid item={true}>
                            <MiniCard title={I18n.t('js.admin.visits.stats.article_visits')}
                                      number={this.props.visitsStats.totalArticleVisits}/>
                        </Grid>

                        <Grid item={true}>
                            <MiniCard title={I18n.t('js.admin.visits.stats.clicks')}
                                      number={this.props.visitsStats.totalClicks}/>
                        </Grid>
                    </Grid>

                    <Grid container={true}
                          className={this.props.classes.gridContainer}
                          spacing={2}
                          direction="row"
                          justifyContent="space-around"
                          alignItems="center">
                        <Grid item={true}>
                            <MiniCard title={I18n.t('js.admin.visits.stats.pages')}
                                      number={this.props.visitsStats.averagePages}/>
                        </Grid>

                        <Grid item={true}>
                            <MiniCard title={I18n.t('js.admin.visits.stats.bounce')}
                                      number={this.props.visitsStats.bounceRate + '%'}/>
                        </Grid>

                        <Grid item={true}>
                            <MiniCard title={I18n.t('js.admin.visits.stats.duration')}
                                      number={this.props.visitsStats.duration}/>
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
                          justifyContent="space-around"
                          alignItems="center">
                        <Grid item={true}>
                            <MiniCard title={I18n.t('js.admin.visits.tops.total_articles')}
                                      number={this.props.visitsStats.totalArticles}/>
                        </Grid>

                        <Grid item={true}>
                            <MiniCard title={I18n.t('js.admin.visits.tops.total_tags')}
                                      number={this.props.visitsStats.totalTags}/>
                        </Grid>

                        <Grid item={true}>
                            <MiniCard title={I18n.t('js.admin.visits.tops.total_topics')}
                                      number={this.props.visitsStats.totalTopics}/>
                        </Grid>
                    </Grid>

                    <Grid container={true}
                          className={this.props.classes.gridContainer}
                          spacing={2}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start">
                        <Grid item={true}>
                            <List className={this.props.classes.listContainer}>
                                {
                                    this.props.visitsStats.topArticles.map((article) => (
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
                                                          primary={
                                                              <span>
                                                                  <a className={this.props.classes.listItem}
                                                                     href="#"
                                                                     onClick={this._handleShowArticleStats.bind(this, article.id)}>
                                                                      {article.name}
                                                                  </a>

                                                                  <a href={article.link}
                                                                     target="_blank">
                                                                      <OpenInNewIcon
                                                                          className={this.props.classes.listItemLink}/>
                                                                  </a>
                                                              </span>
                                                          }
                                                          secondary={`${article.count} (${article.date})`}/>
                                        </ListItem>
                                    ))
                                }
                            </List>
                        </Grid>

                        <Grid item={true}>
                            <List className={this.props.classes.listContainer}>
                                {
                                    this.props.visitsStats.topTags.map((tag) => (
                                        <ListItem key={tag.name}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <LabelIcon/>
                                                </Avatar>
                                            </ListItemAvatar>

                                            <ListItemText classes={{
                                                primary: this.props.classes.listItemTag,
                                                secondary: this.props.classes.listItemSecondary
                                            }}
                                                          primary={
                                                              <a className={this.props.classes.listItem}
                                                                 target="_blank"
                                                                 href={tag.link}>
                                                                  {tag.name}
                                                              </a>
                                                          }
                                                          secondary={tag.count}/>
                                        </ListItem>
                                    ))
                                }
                            </List>
                        </Grid>

                        <Grid item={true}>
                            <List className={this.props.classes.listContainer}>
                                {
                                    this.props.visitsStats.topTopics.map((topic) => (
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
                                                          primary={
                                                              <a className={this.props.classes.listItem}
                                                                 target="_blank"
                                                                 href={topic.link}>
                                                                  {topic.name}
                                                              </a>
                                                          }
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

                            {this._renderListDetails(this.props.visitsStats.referers)}
                        </div>

                        <div className="col s12 m4">
                            <h3 className={this.props.classes.subtitle}>
                                {I18n.t('js.article.tracking.origins.country')}
                            </h3>

                            {this._renderListDetails(this.props.visitsStats.countries)}
                        </div>

                        <div className="col s12 m4">
                            <h3 className={this.props.classes.subtitle}>
                                {I18n.t('js.article.tracking.origins.utm')}
                            </h3>

                            {this._renderListDetails(this.props.visitsStats.utmSources)}
                        </div>
                    </div>

                    <div className="row margin-top-50">
                        <div className="col s12 m4">
                            <h3 className={this.props.classes.subtitle}>
                                {I18n.t('js.article.tracking.origins.device')}
                            </h3>

                            {this._renderListDetails(this.props.visitsStats.devices)}
                        </div>

                        <div className="col s12 m4">
                            <h3 className={this.props.classes.subtitle}>
                                {I18n.t('js.article.tracking.origins.os')}
                            </h3>

                            {this._renderListDetails(this.props.visitsStats.os)}
                        </div>

                        <div className="col s12 m4">
                            <h3 className={this.props.classes.subtitle}>
                                {I18n.t('js.article.tracking.origins.browser')}
                            </h3>

                            {this._renderListDetails(this.props.visitsStats.browsers)}
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
                    (Object.keys(this.props.visitsStats).length === 0 && this.props.isFetching) &&
                    <div className="center">
                        <Loader size="big"/>
                    </div>
                }

                {
                    Object.keys(this.props.visitsStats).length &&
                    this._renderVisits()
                }

                {
                    this.state.articleIdStats &&
                    <TrackingArticleModal articleId={this.state.articleIdStats}
                                          onClose={this._handleArticleModalClose}/>
                }

                {
                    this.state.visitsDate &&
                    <TrackingVisitModal date={this.state.visitsDate}
                                        onClose={this._handleVisitModalClose}/>
                }
            </div>
        );
    }
}
