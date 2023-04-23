'use strict';

import {
    Link
} from 'react-router-dom';

// Polyfill observer
import 'intersection-observer';
import Observer from '@researchgate/react-intersection-observer';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
    userArticlePath
} from '../../../../constants/routesHelper';

import {
    spyTrackClick,
    spyTrackView
} from '../../../../actions';

import highlight from '../../../modules/highlight';

import ArticleInventoryDisplay from './inventory';
import ArticleTags from '../../properties/tags';
import ArticleActions from '../../properties/actions';
import ArticleAvatarIcon from '../../icons/avatar';


export default @highlight()
class ArticleGridDisplay extends React.PureComponent {
    static propTypes = {
        article: PropTypes.object.isRequired,
        currentUserSlug: PropTypes.string,
        currentUserTopicId: PropTypes.number,
        currentUserTopicSlug: PropTypes.string,
        currentUserTopicVisibility: PropTypes.string,
        isOwner: PropTypes.bool,
        isMinimized: PropTypes.bool,
        isUserArticlesList: PropTypes.bool,
        onEnter: PropTypes.func,
        onExit: PropTypes.func,
        // from highlight
        onShow: PropTypes.func
    };

    static defaultProps = {
        isOwner: false,
        isMinimized: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        wasGlobalMinimized: this.props.isMinimized,
        isFolded: this.props.isMinimized
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

    _handleViewportChange = (event) => {
        if (event.isIntersecting) {
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

    render() {
        const isPrivateInPublic = (this.props.isUserArticlesList || (this.props.currentUserTopicId === this.props.article.topicId && this.props.currentUserTopicVisibility === 'everyone')) && this.props.article.visibility !== 'everyone';
        const isInventoryMode = this.props.article.mode === 'inventory';

        return (
            <Observer threshold={0.2}
                      onChange={this._handleViewportChange}>
                <Card component="article"
                      id={`article-${this.props.article.id}`}
                      className={classNames('article-card-card', {
                          'article-card-card-private': isPrivateInPublic
                      })}
                      itemScope={true}
                      itemType="https://schema.org/BlogPosting">
                    <CardHeader classes={{
                        root: classNames({
                            'article-card-outdated': this.props.article.outdated
                        }),
                        content: 'article-card-cardHeader'
                    }}
                                action={
                                    !isInventoryMode
                                        ?
                                        <IconButton
                                            className={classNames('article-card-expand', {
                                                'article-card-expand-open': this.state.isFolded
                                            })}
                                            aria-expanded={this.state.isFolded}
                                            aria-label="Show more"
                                            onClick={this._handleFoldClick}
                                            size="large">
                                            <ExpandMoreIcon/>
                                        </IconButton>
                                        :
                                        null
                                }
                                title={
                                    !isInventoryMode
                                        ?
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
                                            }}
                                                  item={true}>
                                                <ArticleAvatarIcon user={this.props.article.user}
                                                                   createdDate={this.props.article.date}
                                                                   updatedDate={this.props.article.updatedDate}/>
                                            </Grid>
                                        </Grid>
                                        :
                                        null
                                }
                                subheader={
                                    <Typography component="h1"
                                                className="article-card-grid-title"
                                                noWrap={true}
                                                itemProp="name headline">
                                        <Link className="article-card-grid-title-link"
                                              to={userArticlePath(this.props.article.user.slug, this.props.article.slug)}
                                              itemProp="mainEntityOfPage url"
                                              onClick={spyTrackClick.bind(null, 'article', this.props.article.id, this.props.article.slug, this.props.article.userId, this.props.article.title, this.props.article.topicId)}>
                                            {this.props.article.title}
                                        </Link>
                                    </Typography>
                                }/>

                    <Collapse in={!this.state.isFolded}
                              timeout="auto"
                              unmountOnExit={true}>
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
                                    isInventoryMode
                                        ?
                                        <ArticleInventoryDisplay isList={true}
                                                                 inventories={this.props.article.inventories}/>
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
                                                userSlug={this.props.currentUserSlug}
                                                articleId={this.props.article.id}
                                                articleSlug={this.props.article.slug}
                                                articleTitle={this.props.article.title}
                                                articleUserId={this.props.article.userId}
                                                articleTopicId={this.props.article.topicId}
                                                articleVisibility={this.props.article.visibility}
                                                isOutdated={this.props.article.outdated}/>
                            }
                        </CardActions>
                    </Collapse>

                    {
                        !!isPrivateInPublic &&
                        <div className="article-card-private-message">
                            {I18n.t('js.article.common.private_in_public')}
                        </div>
                    }
                </Card>
            </Observer>
        );
    }
}
