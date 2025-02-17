import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import {InView} from 'react-intersection-observer';

import {
    Link
} from 'react-router';

import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';

import LabelIcon from '@mui/icons-material/Label';

import I18n from '@js/modules/translations';

import {
    userArticlePath,
    userArticlesPath,
    taggedArticlesPath
} from '@js/constants/routesHelper';

import {
    spyTrackClick,
    spyTrackView
} from '@js/actions/metricsActions';

import highlight from '@js/components/modules/highlight';


class ArticleMiniCardDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        currentUserTopicId: PropTypes.number,
        currentUserTopicVisibility: PropTypes.string,
        isUserArticlesList: PropTypes.bool,
        isPaper: PropTypes.bool,
        isHighlighted: PropTypes.bool,
        isFaded: PropTypes.bool,
        hasTags: PropTypes.bool,
        isTagDown: PropTypes.bool,
        onEnter: PropTypes.func,
        onExit: PropTypes.func,
        // from highlight
        onShow: PropTypes.func
    };

    static defaultProps = {
        isPaper: true,
        isHighlighted: false,
        isFaded: true,
        hasTags: true,
        isTagDown: true
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // Highlight code
        if (this.props.isHighlighted && this.props.onShow) {
            this.props.onShow(this.props.article.id);
        }
    }

    _handleViewportChange = (inView, intersectionObserverEntry) => {
        if (intersectionObserverEntry.isIntersecting) {
            spyTrackView('article', this.props.article.id);

            if (this.props.onEnter) {
                this.props.onEnter(this.props.article);
            }
        } else if (this.props.onExit) {
            this.props.onExit(this.props.article);
        }
    };

    _renderArticleTags = () => {
        return (
            <div className="article-mini-card-article-tags">
                {
                    this.props.article.tags.map((tag) => (
                        <Chip key={tag.id}
                              className="article-mini-card-article-tag"
                              component={Link}
                              to={taggedArticlesPath(tag.slug)}
                              onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.userId, tag.name, null)}
                              icon={<LabelIcon/>}
                              label={tag.name}
                              clickable={true}
                              variant="outlined"/>
                    ))
                }
            </div>
        );
    };

    _renderCard = () => {
        const isPrivateInPublic = (this.props.isUserArticlesList || (this.props.currentUserTopicId === this.props.article.topicId && this.props.currentUserTopicVisibility === 'everyone')) && this.props.article.visibility !== 'everyone';

        const contentLength = (this.props.article.contentSummary || this.props.article.content).length;

        return (
            <InView onChange={this._handleViewportChange}
                    rootMargin="-50px">
                <Card id={`article-${this.props.article.id}`}
                      className={classNames('article-mini-card-card', {
                          'article-mini-card-card-paper': this.props.isPaper,
                          'article-mini-card-card-private': isPrivateInPublic
                      })}
                      component="article"
                      itemScope={true}
                      itemType="https://schema.org/BlogPosting">
                    <CardHeader classes={{
                        root: 'article-mini-card-header'
                    }}
                                title={
                                    <h1 className="article-mini-card-extract-title"
                                        itemProp="name headline">
                                        <Link
                                            className={classNames('article-mini-card-extract-title-link', {'article-mini-card-extract-title-link-archived': this.props.article.archived})}
                                            to={userArticlePath(this.props.article.user.slug, this.props.article.slug)}
                                            itemProp="mainEntityOfPage url"
                                            onClick={spyTrackClick.bind(null, 'article', this.props.article.id, this.props.article.slug, this.props.article.userId, this.props.article.title, this.props.article.topicId)}>
                                            {this.props.article.title}
                                        </Link>
                                    </h1>
                                }
                                subheader={!!(this.props.hasTags && !this.props.isTagDown) && this._renderArticleTags()}
                    />

                    <CardContent classes={{
                        root: 'article-mini-card-article-content'
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
                            this.props.article.defaultPicture?.jpg
                                ?
                                <div itemType="https://schema.org/ImageObject"
                                     itemScope={true}
                                     itemProp="image">
                                    <meta itemProp="url"
                                          content={this.props.article.defaultPicture.jpg}/>
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

                        <Grid container={true}
                              classes={{
                                  container: 'article-mini-card-article-info'
                              }}
                              spacing={2}
                              direction="row"
                              justifyContent="flex-start"
                              alignItems="center">
                            <Grid size={{xs: this.props.article.defaultPicture?.jpg ? 8 : 12}}
                                  className={classNames('article-mini-card-header-item', {
                                      'article-mini-card-article-content-faded': this.props.isFaded && contentLength > 120
                                  })}
                                  itemProp="articleBody">
                                <div className="normalized-content normalized-content-extract"
                                     dangerouslySetInnerHTML={{__html: this.props.article.contentSummary || this.props.article.content}}/>

                            </Grid>

                            {
                                !!this.props.article.defaultPicture?.jpg &&
                                <Grid className="article-mini-card-header-item"
                                      size={{xs: 4}}>
                                    <CardMedia className="article-mini-card-media">
                                        <picture>
                                            <source srcSet={this.props.article.defaultPicture.webp}
                                                    type="image/webp"/>
                                            <img className="article-mini-card-media-img"
                                                 srcSet={this.props.article.defaultPicture.jpg}
                                                 src={this.props.article.defaultPicture.jpg}
                                                 loading="lazy"
                                                 alt={this.props.article.name}/>
                                        </picture>
                                    </CardMedia>
                                </Grid>
                            }
                        </Grid>


                        <Grid container={true}
                              classes={{
                                  container: 'article-mini-card-article-info'
                              }}
                              spacing={2}
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center">
                            <Grid className="article-mini-card-header-item">
                                <Grid container={true}
                                      classes={{
                                          container: 'article-mini-card-article-info'
                                      }}
                                      spacing={2}
                                      direction="row"
                                      justifyContent="flex-start"
                                      alignItems="center">
                                    <Grid className="article-mini-card-header-item">
                                        <meta itemProp="author"
                                              content={this.props.article.user.pseudo}/>
                                        <meta itemProp="url"
                                              content={userArticlesPath(this.props.article.user.slug)}/>

                                        <Link className="article-mini-card-user-pseudo"
                                              to={userArticlesPath(this.props.article.user.slug)}
                                              onClick={spyTrackClick.bind(null, 'user', this.props.article.user.id, this.props.article.user.slug, null, this.props.article.user.pseudo, null)}>
                                            {this.props.article.user.pseudo}
                                        </Link>
                                    </Grid>

                                    <Grid className="article-mini-card-header-item">
                                        <div className="article-mini-card-separator"/>
                                    </Grid>

                                    <Grid className="article-mini-card-header-item">
                                        <meta itemProp="datePublished"
                                              content={this.props.article.dateIso}/>

                                        <time className="article-mini-card-date">
                                            {this.props.article.date}
                                        </time>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {
                                !!this.props.isTagDown &&
                                <Grid>
                                    {this._renderArticleTags()}
                                </Grid>
                            }
                        </Grid>
                    </CardContent>

                    {
                        !!isPrivateInPublic &&
                        <div className="article-mini-card-private-message">
                            {I18n.t('js.article.common.private_in_public')}
                        </div>
                    }
                </Card>
            </InView>
        );
    };

    render() {
        if (this.props.isPaper) {
            return (
                <Paper className="article-mini-card-paper"
                       elevation={2}>
                    {this._renderCard()}
                </Paper>
            );
        } else {
            return this._renderCard();
        }
    }
}

export default highlight(false)(ArticleMiniCardDisplay);
