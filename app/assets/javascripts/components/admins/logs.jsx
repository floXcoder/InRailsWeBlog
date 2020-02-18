'use strict';

import _ from 'lodash';

import {
    hot
} from 'react-hot-loader/root';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import {
    fetchLogs
} from '../../actions/admin';

import Loader from '../../components/theme/loader';

import LogLine from './logs/line';
import LogInput from './logs/input';
import LogHelp from './logs/help';

function TabContainer(props) {
    return (
        <Typography component="div"
                    className={props.isActive ? null : 'hidden'}
                    style={{padding: 8 * 3}}>
            {props.children}
        </Typography>
    );
}

const AUTOMATIC_REFRESH_INTERVAL = 5000;
const TOP_SCROLL = 50;

export default @connect(null, {
    fetchLogs
})
@hot
class AdminLogs extends React.PureComponent {
    static propTypes = {
        logFilename: PropTypes.string.isRequired,
        environmentLog: PropTypes.array.isRequired,
        jobLog: PropTypes.array,
        cronLog: PropTypes.array,
        // from connect
        fetchLogs: PropTypes.func
    };

    constructor(props) {
        super(props);

        this._logParentNode = null;
        this._logNode = null;
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
        const logInterval = setInterval(() => {
            if (this.state.isAutoRefresh && this.state.searchTags.length === 0 && window.location.search.length === 0) {
                this._fetchLog('refresh');
            }
        }, AUTOMATIC_REFRESH_INTERVAL);

        this._scrollToBottomLog();

        if (this._logParentNode) {
            this._logParentNode.addEventListener('scroll', this._handleScrollChange);
        }
    }

    _handleTabChange = (event, value) => {
        this.setState({tabStep: value});
    };

    _handleScrollChange = _.debounce((event) => {
        if (this.state.errors || this.state.isFetching || !this.state.hasMore) {
            return;
        }

        if (event.target.scrollTop < TOP_SCROLL) {
            this._fetchLog('top', this.state.environmentLog.length);
        }
    }, 100);

    _fetchLog = (element, value, logName = 'environment') => {
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
            .then((data) => {
                const previousScrollHeight = this._logNode.scrollHeight;

                this.setState({
                    isFetching: false,
                    isFetchingTop: false,
                    environmentLog: data.environmentLog,
                    hasMore: !element || element === 'refresh' || element === 'top',
                    errors: null
                }, () => {
                    if (element === 'top') {
                        this._logParentNode.scrollTop = this._logNode.scrollHeight - previousScrollHeight - 44;
                    } else if (element === 'refresh') {
                        // do nothing
                    } else if (element === 'date' || (value?.startsWith('date='))) {
                        this._scrollToTopLog();
                    } else {
                        this._scrollToBottomLog();
                    }
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
        if (this._logParentNode && this._logNode) {
            this._logParentNode.scrollTop = 0;
        }
    };

    _scrollToBottomLog = () => {
        if (this._logParentNode && this._logNode) {
            this._logParentNode.scrollTop = this._logNode.scrollHeight;
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
                    <Tab label="job"/>
                    <Tab label="Cron"/>
                </Tabs>

                <TabContainer isActive={this.state.tabStep === 0}>
                    <div className="file-holder">
                        <div className="file-title">
                            {this.props.logFilename}
                        </div>

                        {
                            (this.state.isFetching && !this.state.isFetchingTop) &&
                            <div className="file-loading">
                                <div className="file-loading-loader">
                                    <Loader size="big"/>
                                </div>
                            </div>
                        }

                        <div ref={(el) => this._logParentNode = el}
                             className="file-content logs">
                            <ol ref={(el) => this._logNode = el}>
                                {
                                    this.state.environmentLog && this.state.environmentLog.map((line, i) => (
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

                        <LogHelp isOpen={this.state.isHelpOpen}
                                 onHelpClose={this._handleHelpClose}/>
                    </div>
                </TabContainer>

                <TabContainer isActive={this.state.tabStep === 1}>
                    <div className="file-holder">
                        <div className="file-title">
                            job log
                        </div>

                        <div className="file-content logs">
                            <ol>
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

                        <div className="file-content logs">
                            <ol>
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
            </Paper>
        );
    }
}

