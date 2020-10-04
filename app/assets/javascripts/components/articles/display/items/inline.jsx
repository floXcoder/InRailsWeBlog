'use strict';

import {
    Link
} from 'react-router-dom';

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
        id: PropTypes.number.isRequired,
        mode: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        userSlug: PropTypes.string.isRequired,
        visibility: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        onInlineEdit: PropTypes.func.isRequired,
        currentUserTopicId: PropTypes.number,
        currentUserTopicVisibility: PropTypes.string,
        title: PropTypes.string,
        inventories: PropTypes.array,
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
            spyTrackView('article', this.props.id);

            if (this.props.onShow) {
                this.props.onShow(this.props.id);
            }

            if (this.props.onEnter) {
                this.props.onEnter({
                    id: this.props.id
                });
            }
        } else {
            if (this.props.onExit) {
                this.props.onExit({
                    id: this.props.id
                });
            }
        }
    };

    _handleTitleClick = () => {
        spyTrackClick('article', this.props.id, this.props.slug, this.props.title);
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
                <article id={`article-${this.props.id}`}
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
                        this.props.title &&
                        <Link to={userArticlePath(this.props.userSlug, this.props.slug)}
                              onClick={this._handleTitleClick}>
                            <h1 className={this.props.classes.title}>
                                {this.props.title}
                            </h1>
                        </Link>
                    }

                    <Collapse in={!this.state.isFolded}
                              timeout="auto"
                              unmountOnExit={true}>
                        {
                            this.props.mode === 'inventory'
                                ?
                                <ArticleInventoryDisplay inventories={this.props.inventories}/>
                                :
                                <div className="normalized-content"
                                     dangerouslySetInnerHTML={{__html: this.props.content}}/>
                        }
                    </Collapse>

                    {
                        !this.state.isFolded &&
                        <div className={this.props.classes.floatingButtons}>
                            <div className={this.props.classes.floatingIcons}>
                                <ArticleLinkIcon articleId={this.props.id}
                                                 articleSlug={this.props.slug}
                                                 articleTitle={this.props.title}
                                                 userSlug={this.props.userSlug}
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
