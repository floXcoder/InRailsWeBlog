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

    constructor(props) {
        super(props);

        if (this.props.currentUserId) {
            props.fetchUserRecents(this.props.currentUserId, {limit: this.props.limit});
        } else {
            this.state.recents = this._formatRecents(getTracksClick());
        }
    }

    state = {
        recents: []
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.recents !== nextProps.recents) {
            this.setState({
                recents: this._formatRecents(nextProps.recents.concat(getTracksClick()))
            })
        } else if (this.props.currentPath !== nextProps.currentPath) {
            this.setState({
                recents: this._formatRecents(this.props.recents.concat(getTracksClick()))
            })
        }
    }

    _formatRecents = (recents) => {
        if (recents) {
            return recents.compact().sort((a, b) => b.date - a.date).limit(this.props.limit).slice().reverse();
        } else {
            return [];
        }
    };

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
