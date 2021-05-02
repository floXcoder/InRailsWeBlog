'use strict';

import {
    Link
} from 'react-router-dom';

// Polyfill observer
import 'intersection-observer';
import Observer from '@researchgate/react-intersection-observer';

import {
    withStyles
} from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/EditOutlined';

import {
    userArticlePath
} from '../../../../constants/routesHelper';

import {
    spyTrackClick,
    spyTrackView
} from '../../../../actions';

import highlight from '../../../modules/highlight';

import ArticleInventoryDisplay from './inventory';
import ArticleLinkIcon from '../../icons/link';

import styles from '../../../../../jss/article/inline';

export default @highlight()
@withStyles(styles)
class ArticleInlineDisplay extends React.PureComponent {
    static propTypes = {
        article: PropTypes.object.isRequired,
        onInlineEdit: PropTypes.func.isRequired,
        currentUserTopicId: PropTypes.number,
        currentUserTopicVisibility: PropTypes.string,
        isMinimized: PropTypes.bool,
        isOwner: PropTypes.bool,
        onEnter: PropTypes.func,
        onExit: PropTypes.func,
        // from highlight
        onShow: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    static defaultProps = {
        isMinimized: false,
        isOwner: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        wasGlobalMinimized: this.props.isMinimized,
        isFolded: this.props.isMinimized,
        isOver: false
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.wasGlobalMinimized !== nextProps.isMinimized) {
            return {
                ...prevState,
                wasGlobalMinimized: nextProps.isMinimized,
                isFolded: nextProps.isMinimized
            };
        }

        return null;
    }

    _handleViewportChange = event => {
        if (event.isIntersecting) {
            spyTrackView('article', this.props.article.id);

            if (this.props.onShow) {
                this.props.onShow(this.props.article.id);
            }

            if (this.props.onEnter) {
                this.props.onEnter({
                    id: this.props.article.id
                });
            }
        } else {
            if (this.props.onExit) {
                this.props.onExit({
                    id: this.props.article.id
                });
            }
        }
    };

    _handleTitleClick = () => {
        spyTrackClick('article', this.props.article.id, this.props.article.slug, this.props.article.userId, this.props.article.title, this.props.article.topicId);
    };

    _handleFoldClick = (event) => {
        event.preventDefault();

        this.setState({
            isFolded: !this.state.isFolded
        });
    };

    _handleOverEdit = () => {
        this.setState({
            isOver: !this.state.isOver
        })
    };

    render() {
        const isPrivateInPublic = this.props.currentUserTopicId === this.props.article.topicId && this.props.currentUserTopicVisibility === 'everyone' && this.props.article.visibility !== 'everyone';

        return (
            <Observer onChange={this._handleViewportChange}>
                <article id={`article-${this.props.article.id}`}
                         className={classNames(this.props.classes.root, {
                             [this.props.classes.over]: this.state.isOver,
                             [this.props.classes.rootPrivate]: isPrivateInPublic
                         })}>
                    <IconButton className={this.props.classes.expand}
                                aria-expanded={this.state.isFolded}
                                aria-label="Show more"
                                onClick={this._handleFoldClick}>
                        <ExpandMoreIcon/>
                    </IconButton>

                    {
                        this.props.article.title &&
                        <Link to={userArticlePath(this.props.article.user.slug, this.props.article.slug)}
                              onClick={this._handleTitleClick}>
                            <h1 className={this.props.classes.title}>
                                {this.props.article.title}
                            </h1>
                        </Link>
                    }

                    <Collapse in={!this.state.isFolded}
                              timeout="auto"
                              unmountOnExit={true}>
                        {
                            this.props.article.mode === 'inventory'
                                ?
                                <ArticleInventoryDisplay inventories={this.props.article.inventories}/>
                                :
                                <div className="normalized-content"
                                     dangerouslySetInnerHTML={{__html: this.props.article.content}}/>
                        }
                    </Collapse>

                    {
                        !this.state.isFolded &&
                        <div className={this.props.classes.floatingButtons}>
                            <div className={this.props.classes.floatingIcons}>
                                <ArticleLinkIcon articleId={this.props.article.id}
                                                 articleSlug={this.props.article.slug}
                                                 articleTitle={this.props.article.title}
                                                 articleUserId={this.props.article.userId}
                                                 articleTopicId={this.props.article.topicId}
                                                 userSlug={this.props.article.user.slug}
                                                 size="default"
                                                 color="action"/>
                            </div>

                            {
                                this.props.isOwner &&
                                <div className={this.props.classes.floatingIcons}>
                                    <a className="flow-tooltip-bottom"
                                       href="#"
                                       onMouseEnter={this._handleOverEdit}
                                       onMouseLeave={this._handleOverEdit}
                                       onClick={this.props.onInlineEdit}
                                       data-tooltip={I18n.t('js.article.tooltip.edit')}>
                                        <EditIcon color="action"
                                                  fontSize="default"/>
                                    </a>
                                </div>
                            }
                        </div>
                    }

                    {
                        isPrivateInPublic &&
                        <div className={this.props.classes.privateMessage}>
                            {I18n.t('js.article.common.private_in_public')}
                        </div>
                    }
                </article>
            </Observer>
        );
    }
}
