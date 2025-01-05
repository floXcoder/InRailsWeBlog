import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import {
    Link
} from 'react-router';

import {InView} from 'react-intersection-observer';

import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/EditOutlined';

import I18n from '@js/modules/translations';

import {
    userArticlePath
} from '@js/constants/routesHelper';

import {
    spyTrackClick,
    spyTrackView
} from '@js/actions/metricsActions';

import highlight from '@js/components/modules/highlight';

import ArticleInventoryDisplay from '@js/components/articles/display/items/inventory';
import ArticleLinkIcon from '@js/components/articles/icons/link';


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
        onShow: PropTypes.func
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

    _handleViewportChange = (inView, intersectionObserverEntry) => {
        if (intersectionObserverEntry.isIntersecting) {
            spyTrackView('article', this.props.article.id);

            if (this.props.onShow) {
                this.props.onShow(this.props.article.id);
            }

            if (this.props.onEnter) {
                this.props.onEnter({
                    id: this.props.article.id
                });
            }
        } else if (this.props.onExit) {
            this.props.onExit({
                id: this.props.article.id
            });
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
        });
    };

    render() {
        const isPrivateInPublic = this.props.currentUserTopicId === this.props.article.topicId && this.props.currentUserTopicVisibility === 'everyone' && this.props.article.visibility !== 'everyone';

        return (
            <InView onChange={this._handleViewportChange}
                    rootMargin="-50px">
                <article id={`article-${this.props.article.id}`}
                         className={classNames('article-inline-root', {
                             'article-inline-over': this.state.isOver,
                             'article-inline-root-private': isPrivateInPublic
                         })}>
                    <IconButton
                        className="article-inline-expand"
                        aria-expanded={this.state.isFolded}
                        aria-label="Show more"
                        onClick={this._handleFoldClick}
                        size="large">
                        <ExpandMoreIcon/>
                    </IconButton>

                    {
                        !!this.props.article.title &&
                        <Link to={userArticlePath(this.props.article.user.slug, this.props.article.slug)}
                              onClick={this._handleTitleClick}>
                            <h1 className="article-inline-title">
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
                        <div className="article-inline-floating-buttons">
                            <div className="article-inline-floating-icons">
                                <ArticleLinkIcon articleId={this.props.article.id}
                                                 articleSlug={this.props.article.slug}
                                                 articleTitle={this.props.article.title}
                                                 articleUserId={this.props.article.userId}
                                                 articleTopicId={this.props.article.topicId}
                                                 userSlug={this.props.article.user.slug}
                                                 size="medium"
                                                 color="action"/>
                            </div>

                            {
                                !!this.props.isOwner &&
                                <div className="article-inline-floating-icons">
                                    <a className="flow-tooltip-bottom"
                                       href="#"
                                       onMouseEnter={this._handleOverEdit}
                                       onMouseLeave={this._handleOverEdit}
                                       onClick={this.props.onInlineEdit}
                                       data-tooltip={I18n.t('js.article.tooltip.edit')}>
                                        <EditIcon color="action"
                                                  fontSize="medium"/>
                                    </a>
                                </div>
                            }
                        </div>
                    }

                    {
                        !!isPrivateInPublic &&
                        <div className="article-inline-private-message">
                            {I18n.t('js.article.common.private_in_public')}
                        </div>
                    }
                </article>
            </InView>
        );
    }
}

export default highlight()(ArticleInlineDisplay);