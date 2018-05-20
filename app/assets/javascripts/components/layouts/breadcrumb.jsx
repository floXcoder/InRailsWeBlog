'use strict';

import {
    Link
} from 'react-router-dom';

import {
    fetchUserRecents,
    getTracksClick
} from '../../actions';

import {
    getUserRecents
} from '../../selectors';

@connect((state) => ({
    isUserConnected: state.userState.isConnected,
    currentUserId: state.userState.currentId,
    // currentTopic: state.topicState.currentTopic,
    recents: getUserRecents(state, 8)
}), {
    fetchUserRecents
})
export default class BreadcrumbLayout extends React.Component {
    static propTypes = {
        currentPath: PropTypes.string.isRequired,
        limit: PropTypes.number,
        // From connect
        isUserConnected: PropTypes.bool,
        currentUserId: PropTypes.number,
        recents: PropTypes.array,
        fetchUserRecents: PropTypes.func
        // currentTopic: PropTypes.object,
    };

    static defaultProps = {
        limit: 10
    };

    static _formatRecents = (recents, limit) => {
        if (recents) {
            return recents.compact().sort((a, b) => b.date - a.date).limit(limit).slice().reverse();
        } else {
            return [];
        }
    };

    constructor(props) {
        super(props);
    }

    state = {
        recents: [],
        currentPath: this.props.currentPath
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.recents !== nextProps.recents) {
            return {
                recents: BreadcrumbLayout._formatRecents(nextProps.recents.concat(getTracksClick()), nextProps.limit),
                currentPath: prevState.currentPath
            };
        } else if (prevState.currentPath !== nextProps.currentPath) {
            return {
                recents: BreadcrumbLayout._formatRecents(prevState.recents.concat(getTracksClick()), nextProps.limit),
                currentPath: nextProps.currentPath
            };
        }

        return null;
    }

    componentDidMount() {
        if (this.props.currentUserId) {
            this.props.fetchUserRecents(this.props.currentUserId, {limit: this.props.limit});
        }
    }

    _iconFromType = (type) => {
        if (type === 'article') {
            return 'assignment';
        } else if (type === 'tag') {
            return 'label';
        } else if (type === 'topic') {
            return 'class';
        } else if (type === 'user') {
            return 'account_circle';
        } else {
            return '';
        }
    };

    _linkFromRecent = (recent) => {
        if (recent.type === 'article') {
            return `/article/${recent.slug}`;
        } else if (recent.type === 'tag') {
            return `/tagged/${recent.slug}`;
        } else if (recent.type === 'topic') {
            return `/topic/${recent.slug}`;
        } else if (recent.type === 'user') {
            return `/user/${recent.slug}`;
        } else {
            return '';
        }
    };

    render() {
        // this.props.currentTopic && this.props.currentTopic.name

        return (
            <div className="blog-breadcrumb">
                <ul className="breadcrumb-list">
                    {
                        this.state.recents.map((recent, i) => (
                            <li key={i}>
                                <Link className={(i === this.state.recents.length - 1) ? 'current' : undefined}
                                      to={this._linkFromRecent(recent)}>
                                    <span className="material-icons"
                                          data-icon={this._iconFromType(recent.type)}
                                          aria-hidden="true"/>

                                    <span className="breadcrumb-title">
                                        {recent.title}
                                    </span>
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </div>
        );
    }
}
