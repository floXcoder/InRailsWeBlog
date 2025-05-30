import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import * as Utils from '@js/modules/utils';

import {
    fetchLogs
} from '@js/actions/admin';

import Loader from '@js/components/theme/loader';

import LogLine from '@js/components/admins/logs/line';
import LogInput from '@js/components/admins/logs/input';
import LogHelp from '@js/components/admins/logs/help';

function TabContainer(props) {
    return (
        <Typography component="div"
                    className={props.isActive ? null : 'hide'}
                    style={{padding: 8 * 3}}>
            {props.children}
        </Typography>
    );
}

const AUTOMATIC_REFRESH_INTERVAL = 5000;
const TOP_SCROLL = 50;


class AdminLogs extends React.Component {
    static propTypes = {
        logFilename: PropTypes.string.isRequired,
        environmentLog: PropTypes.array.isRequired,
        jobLog: PropTypes.array,
        cronLog: PropTypes.array,
        ahoyLog: PropTypes.array,
        sentryLog: PropTypes.array,
        seoCacheLog: PropTypes.array,
        // from connect
        fetchLogs: PropTypes.func
    };

    constructor(props) {
        super(props);

        this._envParentNode = null;
        this._envLogNode = null;

        this._jobParentNode = null;
        this._jobLogNode = null;

        this._cronParentNode = null;
        this._cronLogNode = null;

        this._trackerParentNode = null;
        this._trackerLogNode = null;

        this._sentryParentNode = null;
        this._sentryLogNode = null;

        this._seoParentNode = null;
        this._seoLogNode = null;
    }

    state = {
        tabStep: 0,
        environmentLog: this.props.environmentLog,
        hasMore: true,
        isFetching: false,
        isFetchingTop: false,
        errors: null,
        isAutoRefresh: false,
        searchTags: [],
        isHelpOpen: false
    };

    componentDidMount() {
        setInterval(() => {
            if (this.state.isAutoRefresh && this.state.searchTags.length === 0 && window.location.search.length === 0) {
                this._fetchLog('refresh');
            }
        }, AUTOMATIC_REFRESH_INTERVAL);

        this._scrollToBottomLog();

        if (this._envParentNode) {
            this._envParentNode.addEventListener('scroll', this._handleScrollChange);
        }
    }

    _handleTabChange = (event, value) => {
        this.setState({tabStep: value}, () => this._scrollToBottomLog());
    };

    _handleScrollChange = Utils.debounce((event) => {
        if (this.state.errors || this.state.isFetching || !this.state.hasMore) {
            return;
        }

        if (event.target.scrollTop < TOP_SCROLL) {
            this._fetchLog('top', this.state.environmentLog.length);
        }
    }, 100);

    _fetchLog = (element, value /*, logName = 'environment'*/) => {
        if (element !== 'refresh') {
            this.setState({
                isFetching: true,
                isFetchingTop: element === 'top'
            });
        }

        let data = {
            element: element,
            value: value
        };

        if (element === 'search' && value && value.startsWith('date=')) {
            data = {
                element: 'date',
                value: value.split('date=')[1]
            };
        }

        if (Array.isArray(element)) {
            data = {tags: element};
        }

        this.props.fetchLogs(data)
            .then((response) => {
                const previousScrollHeight = this._envLogNode?.scrollHeight;

                this.setState({
                    isFetching: false,
                    isFetchingTop: false,
                    environmentLog: response.environmentLog,
                    hasMore: !element || element === 'refresh' || element === 'top',
                    errors: null
                }, () => {
                    if (element === 'top') {
                        this._envParentNode.scrollTop = (this._envLogNode?.scrollHeight || 0) - previousScrollHeight - 44;
                    } else if (element === 'refresh') {
                        // do nothing
                    } else if (element === 'date' || (value?.startsWith('date=')) || element === 'sort') {
                        this._scrollToTopLog();
                    } else {
                        this._scrollToBottomLog();
                    }

                    window.scroll({
                        top: (document.getElementById('file-content')?.offsetTop || 0) - 40,
                        behavior: 'smooth'
                    });
                });
            })
            .catch((response) => this.setState({
                errors: response.errors
            }));
    };

    _handleLineElementClick = (element, value, event) => {
        event.preventDefault();

        if (element === 'date') {
            this.setState({
                searchTags: [
                    {
                        element: 'date',
                        value: value
                    }
                ]
            });

            this._fetchLog('date', value);
        } else {
            if (this.state.searchTags.filter((searchTag) => searchTag.element === element).length > 0) {
                return;
            }

            const newSearchTags = this.state.searchTags.concat([{
                element,
                value
            }]);

            this.setState({
                searchTags: newSearchTags
            });

            this._fetchLog(newSearchTags);
        }
    };

    _handleTagSearchAdd = (query) => {
        const INPUT_REGEX = /^\s*(\w+?)\s*(:|=)\s*(\w+?)\s*$/;
        const inputRegex = INPUT_REGEX.exec(query);

        if (inputRegex) {
            const [, element, symbol, value] = inputRegex;

            if (this.state.searchTags.filter((searchTag) => searchTag.element === element).length > 0) {
                return true;
            }

            const newSearchTags = this.state.searchTags.concat([{
                element,
                value
            }]);

            this.setState({
                searchTags: newSearchTags
            });

            this._fetchLog(newSearchTags);

            return true;
        } else {
            this._fetchLog('search', query);

            return false;
        }
    };

    _handleTagSearchRemove = (tagElement) => {
        const newSearchTags = this.state.searchTags.filter((searchTag) => searchTag.element !== tagElement);

        this.setState({
            searchTags: newSearchTags
        });

        this._fetchLog(newSearchTags);
    };

    _scrollToTopLog = () => {
        if (this._envParentNode && this._envLogNode) {
            this._envParentNode.scrollTop = 0;
        }
    };

    _scrollToBottomLog = () => {
        if (this._envParentNode && this._envLogNode) {
            this._envParentNode.scrollTop = this._envLogNode.scrollHeight;
        }
        if (this._jobParentNode && this._jobLogNode) {
            this._jobParentNode.scrollTop = this._jobLogNode.scrollHeight;
        }
        if (this._cronParentNode && this._cronLogNode) {
            this._cronParentNode.scrollTop = this._cronLogNode.scrollHeight;
        }
        if (this._trackerParentNode && this._trackerLogNode) {
            this._trackerParentNode.scrollTop = this._trackerLogNode.scrollHeight;
        }
        if (this._sentryParentNode && this._sentryLogNode) {
            this._sentryParentNode.scrollTop = this._sentryLogNode.scrollHeight;
        }
        if (this._seoParentNode && this._seoLogNode) {
            this._seoParentNode.scrollTop = this._seoLogNode.scrollHeight;
        }
    };

    _handleAutoRefreshClick = (event) => {
        event.preventDefault();

        this.setState({isAutoRefresh: !this.state.isAutoRefresh});
    };

    _handleHelpClick = (event) => {
        event.preventDefault();

        this.setState({isHelpOpen: true});
    };

    _handleHelpClose = () => {
        this.setState({isHelpOpen: false});
    };

    _handleQuickTagClick = (tagType, event) => {
        event.preventDefault();

        if (tagType === '404S') {
            this._fetchLog('sort', '404');
        } else {
            const newSearchTags = [];

            if (tagType === '5XX') {
                newSearchTags.push({
                    element: 'status',
                    value: '5[0-9][0-9]'
                });
            } else if (tagType === '4XX') {
                newSearchTags.push({
                    element: 'status',
                    value: '4[0-9][0-9]'
                });
            } else if (tagType === '4YY') {
                newSearchTags.push({
                    element: 'status',
                    value: '(?!404|410)4[0-9][0-9]'
                });
            } else if (tagType === 'error') {
                newSearchTags.push({
                    element: 'search',
                    value: 'error'
                });
            }

            this._fetchLog(newSearchTags);
        }
    };

    render() {
        return (
            <Paper className="container-full margin-top-30"
                   square={true}>
                <Tabs value={this.state.tabStep}
                      indicatorColor="primary"
                      textColor="primary"
                      centered={true}
                      onChange={this._handleTabChange}>
                    <Tab label="Production"/>
                    <Tab label="Jobs"/>
                    <Tab label="Cron"/>
                    <Tab label="Sentry"/>
                    <Tab label="Seo Cache"/>
                </Tabs>

                <TabContainer isActive={this.state.tabStep === 0}>
                    <div className="file-holder">
                        <div className="file-title">
                            {this.props.logFilename}
                        </div>

                        {
                            (!!this.state.isFetching && !this.state.isFetchingTop) &&
                            <div className="file-loading">
                                <div className="file-loading-loader">
                                    <Loader size="big"/>
                                </div>
                            </div>
                        }

                        <div ref={(el) => this._envParentNode = el}
                             id="file-content"
                             className="file-content logs">
                            <ol ref={(el) => this._envLogNode = el}>
                                {
                                    !!this.state.environmentLog &&
                                    this.state.environmentLog.map((line, i) => (
                                        <LogLine key={i}
                                                 onLineElementClick={this._handleLineElementClick}>
                                            {line}
                                        </LogLine>
                                    ))
                                }
                            </ol>
                        </div>

                        <div className="file-input">
                            <LogInput searchTags={this.state.searchTags}
                                      isAutoRefresh={this.state.isAutoRefresh}
                                      onTagSearchAdd={this._handleTagSearchAdd}
                                      onTagSearchRemove={this._handleTagSearchRemove}
                                      onAutoRefreshClick={this._handleAutoRefreshClick}
                                      onHelpClick={this._handleHelpClick}/>
                        </div>

                        <div className="file-quick-tags">
                            <Stack direction="row"
                                   spacing={2}>
                                <Chip label="5XX"
                                      variant="outlined"
                                      size="small"
                                      onClick={this._handleQuickTagClick.bind(this, '5XX')}/>
                                <Chip label="4XX"
                                      variant="outlined"
                                      size="small"
                                      onClick={this._handleQuickTagClick.bind(this, '4XX')}/>
                                <Chip label="4XX (!404 or !410)"
                                      variant="outlined"
                                      size="small"
                                      onClick={this._handleQuickTagClick.bind(this, '4YY')}/>
                                <Chip label="List 404"
                                      variant="outlined"
                                      size="small"
                                      onClick={this._handleQuickTagClick.bind(this, '404S')}/>
                                <Chip label="Error"
                                      variant="outlined"
                                      size="small"
                                      onClick={this._handleQuickTagClick.bind(this, 'error')}/>
                            </Stack>
                        </div>

                        <LogHelp isOpen={this.state.isHelpOpen}
                                 onHelpClose={this._handleHelpClose}/>
                    </div>
                </TabContainer>

                <TabContainer isActive={this.state.tabStep === 1}>
                    <div className="file-holder">
                        <div className="file-title">
                            Jobs log
                        </div>

                        <div ref={(el) => this._jobParentNode = el}
                             className="file-content logs">
                            <ol ref={(el) => this._jobLogNode = el}>
                                {
                                    this.props.jobLog?.map((line, i) => (
                                        <li key={i}>
                                            <p dangerouslySetInnerHTML={{__html: line}}/>
                                        </li>
                                    ))
                                }
                            </ol>
                        </div>
                    </div>
                </TabContainer>

                <TabContainer isActive={this.state.tabStep === 2}>
                    <div className="file-holder">
                        <div className="file-title">
                            Cron log
                        </div>

                        <div ref={(el) => this._cronParentNode = el}
                             className="file-content logs">
                            <ol ref={(el) => this._cronLogNode = el}>
                                {
                                    this.props.cronLog?.map((line, i) => (
                                        <li key={i}>
                                            <p dangerouslySetInnerHTML={{__html: line}}/>
                                        </li>
                                    ))
                                }
                            </ol>
                        </div>
                    </div>
                </TabContainer>

                <TabContainer isActive={this.state.tabStep === 3}>
                    <div className="file-holder">
                        <div className="file-title">
                            Tracker log
                        </div>

                        <div ref={(el) => this._trackerParentNode = el}
                             className="file-content logs">
                            <ol ref={(el) => this._trackerLogNode = el}>
                                {
                                    this.props.ahoyLog?.map((line, i) => (
                                        <li key={i}>
                                            <p dangerouslySetInnerHTML={{__html: line}}/>
                                        </li>
                                    ))
                                }
                            </ol>
                        </div>
                    </div>
                </TabContainer>

                <TabContainer isActive={this.state.tabStep === 4}>
                    <div className="file-holder">
                        <div className="file-title">
                            Sentry log
                        </div>

                        <div ref={(el) => this._sentryParentNode = el}
                             className="file-content logs">
                            <ol ref={(el) => this._sentryLogNode = el}>
                                {
                                    this.props.sentryLog?.map((line, i) => (
                                        <li key={i}>
                                            <p dangerouslySetInnerHTML={{__html: line}}/>
                                        </li>
                                    ))
                                }
                            </ol>
                        </div>
                    </div>
                </TabContainer>

                <TabContainer isActive={this.state.tabStep === 5}>
                    <div className="file-holder">
                        <div className="file-title">
                            SEO Cache log
                        </div>

                        <div ref={(el) => this._seoParentNode = el}
                             className="file-content logs">
                            <ol ref={(el) => this._seoLogNode = el}>
                                {
                                    this.props.seoCacheLog?.map((line, i) => (
                                        <li key={i}>
                                            <p dangerouslySetInnerHTML={{__html: line}}/>
                                        </li>
                                    ))
                                }
                            </ol>
                        </div>
                    </div>
                </TabContainer>
            </Paper>
        );
    }
}

export default connect(null, {
    fetchLogs
})(AdminLogs);