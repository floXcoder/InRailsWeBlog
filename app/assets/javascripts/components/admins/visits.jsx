import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import classNames from 'classnames';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';

import LabelIcon from '@mui/icons-material/Label';
import ClassIcon from '@mui/icons-material/Class';
import AssignmentIcon from '@mui/icons-material/Assignment';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import I18n from '@js/modules/translations';

import {
    fetchVisits
} from '@js/actions/admin';

import Loader from '@js/components/theme/loader';
import MiniCard from '@js/components/material-ui/miniCard';

import TrackingArticleModal from '@js/components/articles/tracking';
import TrackingVisitModal from '@js/components/visits/tracking';


class AdminVisits extends React.Component {
    static propTypes = {
        // from connect
        isFetching: PropTypes.bool,
        visitsStats: PropTypes.object,
        fetchVisits: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    state = {
        articleIdStats: undefined,
        visitsDate: undefined
    };

    componentDidMount() {
        this.props.fetchVisits({}, {}, {noCache: true});
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
                    <p className="admin-visits-list-item">
                        <em>{I18n.t('js.article.tracking.undefined')}</em>
                    </p>
                </div>
            );
        }

        return (
            <List className="admin-visits-list-container"
                  dense={true}>
                {
                    Object.entries(listDetails)
                        .map(([element, count], i) => (
                            <ListItem key={i}>
                                <ListItemText className="admin-visits-list-item"
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
                                              }
                                              secondaryAction={
                                                  <div className={classNames('admin-visits-list-item', {
                                                      'margin-top-10': (!element || element === 'internal' || element === 'others')
                                                  })}>
                                                      {count}
                                                  </div>
                                              }/>
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
                    <h2 className="admin-visits-title">
                        {I18n.t('js.admin.visits.uniq.title')}
                    </h2>

                    <TableContainer component={Paper}
                                    className="admin-visits-table-container">
                        <Table aria-label="visits by days">
                            <TableHead>
                                <TableRow>
                                    <TableCell className="admin-visits-table-data"
                                               align="left">
                                        {I18n.t('js.admin.visits.uniq.data')}
                                    </TableCell>

                                    {
                                        Object.keys(this.props.visitsStats.dates)
                                            .map((date) => (
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
                                    <TableCell className="admin-visits-table-data"
                                               align="left">
                                        {I18n.t('js.admin.visits.uniq.day')}
                                    </TableCell>

                                    {
                                        Object.entries(this.props.visitsStats.dates)
                                            .map(([date, count], i) => (
                                                <TableCell key={i}
                                                           align="center">
                                                    <a className="admin-visits-table-data-item"
                                                       href="#"
                                                       onClick={this._handleShowVisitsDate.bind(this, date)}>
                                                        {count}
                                                    </a>
                                                </TableCell>
                                            ))
                                    }
                                </TableRow>

                                {/*<TableRow>*/}
                                {/*    <TableCell className={admin-visits-tableData}*/}
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
                    <h2 className="admin-visits-title">
                        {I18n.t('js.admin.visits.stats.title')}
                    </h2>

                    <Grid container={true}
                          className="admin-visits-grid-container"
                          spacing={2}
                          direction="row"
                          justifyContent="space-around"
                          alignItems="center">
                        <Grid>
                            <MiniCard title={I18n.t('js.admin.visits.stats.visits')}
                                      number={this.props.visitsStats.totalUniqVisits}/>
                        </Grid>

                        <Grid>
                            <MiniCard title={I18n.t('js.admin.visits.stats.article_visits')}
                                      number={this.props.visitsStats.totalArticleVisits}/>
                        </Grid>

                        <Grid>
                            <MiniCard title={I18n.t('js.admin.visits.stats.clicks')}
                                      number={this.props.visitsStats.totalClicks}/>
                        </Grid>
                    </Grid>

                    <Grid container={true}
                          className="admin-visits-grid-container"
                          spacing={2}
                          direction="row"
                          justifyContent="space-around"
                          alignItems="center">
                        <Grid>
                            <MiniCard title={I18n.t('js.admin.visits.stats.pages')}
                                      number={this.props.visitsStats.averagePages}/>
                        </Grid>

                        <Grid>
                            <MiniCard title={I18n.t('js.admin.visits.stats.bounce')}
                                      number={this.props.visitsStats.bounceRate + '%'}/>
                        </Grid>

                        <Grid>
                            <MiniCard title={I18n.t('js.admin.visits.stats.duration')}
                                      number={this.props.visitsStats.duration}/>
                        </Grid>
                    </Grid>
                </div>

                <div className="col s12 margin-top-40">
                    <h2 className="admin-visits-title">
                        {I18n.t('js.admin.visits.tops.title')}
                    </h2>

                    <Grid container={true}
                          className="admin-visits-grid-container"
                          spacing={2}
                          direction="row"
                          justifyContent="space-around"
                          alignItems="center">
                        <Grid>
                            <MiniCard title={I18n.t('js.admin.visits.tops.total_articles')}
                                      number={this.props.visitsStats.totalArticles}/>
                        </Grid>

                        <Grid>
                            <MiniCard title={I18n.t('js.admin.visits.tops.total_tags')}
                                      number={this.props.visitsStats.totalTags}/>
                        </Grid>

                        <Grid>
                            <MiniCard title={I18n.t('js.admin.visits.tops.total_topics')}
                                      number={this.props.visitsStats.totalTopics}/>
                        </Grid>
                    </Grid>

                    <Grid container={true}
                          className="admin-visits-grid-container"
                          spacing={2}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start">
                        <Grid>
                            <List className="admin-visits-list-container">
                                {
                                    this.props.visitsStats.topArticles.map((article) => (
                                        <ListItem key={article.name}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <AssignmentIcon/>
                                                </Avatar>
                                            </ListItemAvatar>

                                            <ListItemText classes={{
                                                primary: 'admin-visits-list-item',
                                                secondary: 'admin-visits-list-item-secondary'
                                            }}
                                                          primary={
                                                              <span>
                                                                  <a className="admin-visits-list-item"
                                                                     href="#"
                                                                     onClick={this._handleShowArticleStats.bind(this, article.id)}>
                                                                      {article.name}
                                                                  </a>

                                                                  <a href={article.link}
                                                                     target="_blank">
                                                                      <OpenInNewIcon
                                                                          className="admin-visits-list-item-link"/>
                                                                  </a>
                                                              </span>
                                                          }
                                                          secondary={`${article.count} (${article.date})`}/>
                                        </ListItem>
                                    ))
                                }
                            </List>
                        </Grid>

                        <Grid>
                            <List className="admin-visits-list-container">
                                {
                                    this.props.visitsStats.topTags.map((tag) => (
                                        <ListItem key={tag.name}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <LabelIcon/>
                                                </Avatar>
                                            </ListItemAvatar>

                                            <ListItemText classes={{
                                                primary: 'admin-visits-list-item-tag',
                                                secondary: 'admin-visits-list-item-secondary'
                                            }}
                                                          primary={
                                                              <a className="admin-visits-list-item"
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

                        <Grid>
                            <List className="admin-visits-list-container">
                                {
                                    this.props.visitsStats.topTopics.map((topic) => (
                                        <ListItem key={topic.name}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <ClassIcon/>
                                                </Avatar>
                                            </ListItemAvatar>

                                            <ListItemText classes={{
                                                primary: 'admin-visits-list-item',
                                                secondary: 'admin-visits-list-item-secondary'
                                            }}
                                                          primary={
                                                              <a className="admin-visits-list-item"
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
                    <h2 className="admin-visits-title">
                        {I18n.t('js.admin.visits.sources.title')}
                    </h2>

                    <div className="row">
                        <div className="col s12 m4">
                            <h3 className="admin-visits-subtitle">
                                {I18n.t('js.article.tracking.origins.referer')}
                            </h3>

                            {this._renderListDetails(this.props.visitsStats.referrers)}
                        </div>

                        <div className="col s12 m4">
                            <h3 className="admin-visits-subtitle">
                                {I18n.t('js.article.tracking.origins.country')}
                            </h3>

                            {this._renderListDetails(this.props.visitsStats.countries)}
                        </div>

                        <div className="col s12 m4">
                            <h3 className="admin-visits-subtitle">
                                {I18n.t('js.article.tracking.origins.utm')}
                            </h3>

                            {this._renderListDetails(this.props.visitsStats.utmSources)}
                        </div>
                    </div>

                    <div className="row margin-top-50">
                        <div className="col s12 m4">
                            <h3 className="admin-visits-subtitle">
                                {I18n.t('js.article.tracking.origins.device')}
                            </h3>

                            {this._renderListDetails(this.props.visitsStats.devices)}
                        </div>

                        <div className="col s12 m4">
                            <h3 className="admin-visits-subtitle">
                                {I18n.t('js.article.tracking.origins.os')}
                            </h3>

                            {this._renderListDetails(this.props.visitsStats.os)}
                        </div>

                        <div className="col s12 m4">
                            <h3 className="admin-visits-subtitle">
                                {I18n.t('js.article.tracking.origins.browser')}
                            </h3>

                            {this._renderListDetails(this.props.visitsStats.browsers)}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        return (
            <div>
                <h1 className="center-align">
                    {I18n.t('js.admin.visits.title')}
                </h1>

                {
                    !!(Object.keys(this.props.visitsStats).length === 0 && this.props.isFetching) &&
                    <div className="center">
                        <Loader size="big"/>
                    </div>
                }

                {
                    !!Object.keys(this.props.visitsStats).length &&
                    this._renderVisits()
                }

                {
                    !!this.state.articleIdStats &&
                    <TrackingArticleModal articleId={this.state.articleIdStats}
                                          onClose={this._handleArticleModalClose}/>
                }

                {
                    !!this.state.visitsDate &&
                    <TrackingVisitModal date={this.state.visitsDate}
                                        onClose={this._handleVisitModalClose}/>
                }
            </div>
        );
    }
}

export default connect((state) => ({
    visitsStats: state.adminState.visitsStats,
    isFetching: state.adminState.isFetching
}), {
    fetchVisits
})(AdminVisits);