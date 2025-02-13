import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import {
    Link
} from 'react-router';

import {InView} from 'react-intersection-observer';

import Sticky from 'react-sticky-el';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
// import CardMedia from '@mui/material/CardMedia';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid2';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
import ArticleTags from '@js/components/articles/properties/tags';
import ArticleFloatingIcons from '@js/components/articles/properties/floatingIcons';
import ArticleActions from '@js/components/articles/properties/actions';
import ArticleAvatarIcon from '@js/components/articles/icons/avatar';


class ArticleCardDisplay extends React.PureComponent {
    static propTypes = {
        article: PropTypes.object.isRequired,
        currentUserSlug: PropTypes.string,
        currentUserTopicId: PropTypes.number,
        currentUserTopicSlug: PropTypes.string,
        currentUserTopicVisibility: PropTypes.string,
        isOwner: PropTypes.bool,
        // isOutdated: PropTypes.bool,
        isMinimized: PropTypes.bool,
        isUserArticlesList: PropTypes.bool,
        hasActions: PropTypes.bool,
        onEnter: PropTypes.func,
        onExit: PropTypes.func,
        // from highlight
        onShow: PropTypes.func
    };

    static defaultProps = {
        isOwner: false,
        // isOutdated: false,
        isMinimized: false,
        hasActions: true
    };

    constructor(props) {
        super(props);
    }

    state = {
        wasGlobalMinimized: this.props.isMinimized,
        isFolded: this.props.isMinimized || this.props.article.archived
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
                this.props.onEnter(this.props.article);
            }
        } else if (this.props.onExit) {
            this.props.onExit(this.props.article);
        }
    };

    _handleFoldClick = (event) => {
        event.preventDefault();

        this.setState({
            isFolded: !this.state.isFolded
        });
    };

    _handleTitleClick = () => {
        spyTrackClick('article', this.props.article.id, this.props.article.slug, this.props.article.userId, this.props.article.title, this.props.article.topicId);
    };

    render() {
        const isPrivateInPublic = (this.props.isUserArticlesList || (this.props.currentUserTopicId === this.props.article.topicId && this.props.currentUserTopicVisibility === 'everyone')) && this.props.article.visibility !== 'everyone';

        return (
            <InView onChange={this._handleViewportChange}
                    rootMargin="-50px">
                <Card component="article"
                      id={`article-${this.props.article.id}`}
                      className={classNames('article-card-article-card', {
                          'article-card-card-folded': this.state.isFolded,
                          'article-card-card-private': isPrivateInPublic,
                          'article-card-card-outdated': this.props.article.outdated
                      })}
                      itemScope={true}
                      itemType="https://schema.org/BlogPosting">
                    {
                        !!(this.props.hasActions && !this.state.isFolded) &&
                        <div className="article-card-floating-buttons">
                            <Sticky boundaryElement={`#article-${this.props.article.id}`}
                                    topOffset={60}
                                    bottomOffset={310}>
                                <div className="article-card-floating-buttons">
                                    <ArticleFloatingIcons className="article-card-floating-icons"
                                                          display="list"
                                                          size="medium"
                                                          color="action"
                                                          isOwner={this.props.isOwner}
                                                          userSlug={this.props.article.user.slug}
                                                          articleId={this.props.article.id}
                                                          articleSlug={this.props.article.slug}
                                                          articleUserId={this.props.article.userId}
                                                          articleTopicId={this.props.article.topicId}
                                                          articleTitle={this.props.article.title}/>
                                </div>
                            </Sticky>
                        </div>
                    }

                    <CardHeader classes={{
                        root: 'article-card-header'
                    }}
                                action={
                                    <IconButton className={classNames('article-card-expand', {
                                        'article-card-expand-open': this.state.isFolded
                                    })}
                                                aria-expanded={this.state.isFolded}
                                                aria-label="Show more"
                                                onClick={this._handleFoldClick}
                                                size="large">
                                        <ExpandMoreIcon/>
                                    </IconButton>
                                }
                                title={
                                    <Grid container={true}
                                          classes={{
                                              container: 'article-card-article-info'
                                          }}
                                          spacing={2}
                                          direction="row"
                                          justifyContent="space-between"
                                          alignItems="center">
                                        <Grid classes={{
                                            item: 'article-card-info-item'
                                        }}>
                                            <ArticleAvatarIcon user={this.props.article.user}
                                                               createdDate={this.props.article.date}
                                                               updatedDate={this.props.article.updatedDate}/>
                                        </Grid>
                                    </Grid>
                                }
                                subheader={
                                    <>
                                        <h1 className="article-card-title"
                                            itemProp="name headline">
                                            <Link className={classNames('article-card-title-link', {'article-card-title-link-archived': this.props.article.archived})}
                                                  to={userArticlePath(this.props.article.user.slug, this.props.article.slug)}
                                                  itemProp="mainEntityOfPage url"
                                                  onClick={this._handleTitleClick}>
                                                {this.props.article.title}
                                            </Link>
                                        </h1>

                                        {
                                            this.props.article.tags.length > 0 &&
                                            <ArticleTags articleId={this.props.article.id}
                                                         tags={this.props.article.tags}
                                                         className="margin-top-5"
                                                         isSmall={true}
                                                         isOwner={this.props.isOwner}
                                                         currentUserSlug={this.props.currentUserSlug}
                                                         currentUserTopicSlug={this.props.currentUserTopicSlug}
                                                         parentTagIds={this.props.article.parentTagIds}
                                                         childTagIds={this.props.article.childTagIds}/>
                                        }
                                    </>
                                }/>

                    <Collapse in={!this.state.isFolded}
                              timeout="auto"
                              unmountOnExit={true}>
                        {
                            // !!this.props.article.defaultPicture?.jpg &&
                            // <CardMedia className="article-card-media">
                            //     <picture>
                            //         <source srcSet={this.props.article.defaultPicture.webp}
                            //                 type="image/webp"/>
                            //         <img className="article-mini-card-media-img"
                            //              srcSet={this.props.article.defaultPicture.jpg}
                            //              src={this.props.article.defaultPicture.jpg}
                            //              loading="lazy"
                            //              alt={this.props.article.name}/>
                            //     </picture>
                            // </CardMedia>
                        }

                        <CardContent classes={{
                            root: 'article-card-content'
                        }}>
                            <meta itemProp="dateModified"
                                  content={this.props.article.dateIso}/>

                            <div itemType="https://schema.org/Organization"
                                 itemProp="publisher"
                                 itemScope={true}>
                                <div itemType="https://schema.org/ImageObject"
                                     itemProp="logo"
                                     itemScope={true}>
                                    <meta itemProp="url"
                                          content={window.logoUrl}/>
                                    <meta itemProp="width"
                                          content="192"/>
                                    <meta itemProp="height"
                                          content="192"/>
                                </div>
                                <meta itemProp="name"
                                      content={window.settings.website_name}/>
                            </div>

                            {
                                this.props.article.defaultPicture
                                    ?
                                    <div itemType="https://schema.org/ImageObject"
                                         itemScope={true}
                                         itemProp="image">
                                        <meta itemProp="url"
                                              content={this.props.article.defaultPicture}/>
                                        <meta itemProp="width"
                                              content="320"/>
                                        <meta itemProp="height"
                                              content="320"/>
                                    </div>
                                    :
                                    <div itemType="https://schema.org/ImageObject"
                                         itemScope={true}
                                         itemProp="image">
                                        <meta itemProp="url"
                                              content={window.logoUrl}/>
                                        <meta itemProp="width"
                                              content="320"/>
                                        <meta itemProp="height"
                                              content="320"/>
                                    </div>
                            }

                            <div itemProp="articleBody">
                                {
                                    this.props.article.mode === 'inventory'
                                        ?
                                        <ArticleInventoryDisplay inventories={this.props.article.inventories}/>
                                        :
                                        <div className="normalized-content"
                                             dangerouslySetInnerHTML={{__html: this.props.article.content}}/>
                                }
                            </div>
                        </CardContent>

                        <CardActions className="article-card-actions"
                                     disableSpacing={true}>
                            {
                                this.props.article.tags.length > 0 &&
                                <ArticleTags articleId={this.props.article.id}
                                             tags={this.props.article.tags}
                                             isOwner={this.props.isOwner}
                                             currentUserSlug={this.props.currentUserSlug}
                                             currentUserTopicSlug={this.props.currentUserTopicSlug}
                                             parentTagIds={this.props.article.parentTagIds}
                                             childTagIds={this.props.article.childTagIds}/>
                            }

                            {
                                !!this.props.isOwner &&
                                <ArticleActions isInline={true}
                                                userSlug={this.props.article.user.slug}
                                                articleId={this.props.article.id}
                                                articleSlug={this.props.article.slug}
                                                articleUserId={this.props.article.userId}
                                                articleTopicId={this.props.article.topicId}
                                                articleTitle={this.props.article.title}
                                                articleVisibility={this.props.article.visibility}
                                                isOutdated={this.props.article.outdated}/>
                            }
                        </CardActions>
                    </Collapse>

                    {
                        !!isPrivateInPublic &&
                        <div className="article-card-private-message article-card-private-message-top">
                            {I18n.t('js.article.common.private_in_public')}
                        </div>
                    }
                </Card>
            </InView>
        );
    }
}

export default highlight()(ArticleCardDisplay);