'use strict';

import {
    Link
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

import AssignmentIcon from '@material-ui/icons/Assignment';
import LabelIcon from '@material-ui/icons/Label';
import ClassIcon from '@material-ui/icons/Class';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import {
    userArticlePath,
    taggedArticlesPath,
    topicArticlesPath,
    userHomePath
} from '../../constants/routesHelper';

import {
    getUserRecents
} from '../../selectors';

import styles from '../../../jss/user/breadcrumb';

export default @connect((state, props) => ({
    recents: getUserRecents(state, props.recentsLimit)
}))
@withStyles(styles)
class BreadcrumbLayout extends React.Component {
    static propTypes = {
        currentPath: PropTypes.string.isRequired,
        recentsLimit: PropTypes.number,
        // from connect
        recents: PropTypes.array,
        // from styles
        classes: PropTypes.object
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
                recents: _formatRecents(nextProps.recents, nextProps.recentsLimit),
                currentPath: prevState.currentPath
            };
        } else if (prevState.currentPath !== nextProps.currentPath) {
            return {
                recents: _formatRecents(prevState.recents, nextProps.recentsLimit),
                currentPath: nextProps.currentPath
            };
        }

        return null;
    }

    _iconFromType = (type) => {
        if (type === 'article') {
            return <AssignmentIcon/>;
        } else if (type === 'tag') {
            return <LabelIcon/>;
        } else if (type === 'topic') {
            return <ClassIcon/>;
        } else if (type === 'user') {
            return <AccountCircleIcon/>;
        } else {
            return null;
        }
    };

    _linkFromRecent = (recent) => {
        if (recent.type === 'article') {
            return userArticlePath(recent.userSlug, recent.slug);
        } else if (recent.type === 'tag') {
            return taggedArticlesPath(recent.slug);
        } else if (recent.type === 'topic') {
            return topicArticlesPath(recent.userSlug, recent.slug);
        } else if (recent.type === 'user') {
            return userHomePath(recent.slug);
        } else {
            return '';
        }
    };

    render() {
        // this.props.currentTopic && this.props.currentTopic.name

        return (
            <div className={this.props.classes.breadcrumb}
                 aria-label="Breadcrumb navigation">
                {
                    this.state.recents.map((recent, i) => (
                        <Chip key={i}
                              icon={this._iconFromType(recent.type)}
                              label={recent.title}
                              className={classNames(this.props.classes.chip, {
                                  [this.props.classes.currentChip]: i === this.state.recents.length - 1
                              })}
                              variant="outlined"
                              clickable={true}
                              component={Link}
                              to={this._linkFromRecent(recent)}/>
                    ))
                }
            </div>
        );
    }
}
