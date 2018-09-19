'use strict';

import {
    Link
} from 'react-router-dom';

import {
    getTracksClick
} from '../../actions';

import {
    getUserRecents
} from '../../selectors';

export default @connect((state, props) => ({
    isUserConnected: state.userState.isConnected,
    currentUserId: state.userState.currentId,
    // currentTopic: state.topicState.currentTopic,
    recents: getUserRecents(state, props.recentsLimit)
}))
class BreadcrumbLayout extends React.Component {
    static propTypes = {
        currentPath: PropTypes.string.isRequired,
        recentsLimit: PropTypes.number,
        // From connect
        isUserConnected: PropTypes.bool,
        currentUserId: PropTypes.number,
        recents: PropTypes.array
        // currentTopic: PropTypes.object,
    };

    constructor(props) {
        super(props);
    }

    state = {
        recents: [],
        currentPath: this.props.currentPath
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        const _formatRecents = (recents, recentsLimit) => {
            if (recents) {
                return recents.compact().sort((a, b) => b.date - a.date).limit(recentsLimit).slice().reverse();
            } else {
                return [];
            }
        };

        if (prevState.recents !== nextProps.recents) {
            return {
                recents: _formatRecents(nextProps.recents.concat(getTracksClick()), nextProps.recentsLimit),
                currentPath: prevState.currentPath
            };
        } else if (prevState.currentPath !== nextProps.currentPath) {
            return {
                recents: _formatRecents(prevState.recents.concat(getTracksClick()), nextProps.recentsLimit),
                currentPath: nextProps.currentPath
            };
        }

        return null;
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
