'use strict';

import {
    Link
} from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';

import LabelIcon from '@material-ui/icons/Label';

import {
    userArticlePath,
    userArticlesPath,
    taggedArticlesPath
} from '../../../../constants/routesHelper';

import {
    spyTrackClick
} from '../../../../actions';

import highlight from '../../../modules/highlight';


export default @highlight()
class ArticleMiniCardDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        currentUserTopicId: PropTypes.number,
        currentUserTopicVisibility: PropTypes.string,
        isUserArticlesList: PropTypes.bool,
        isPaper: PropTypes.bool,
        isFaded: PropTypes.bool,
        hasTags: PropTypes.bool,
        isTagDown: PropTypes.bool
    };

    static defaultProps = {
        isPaper: true,
        isFaded: false,
        hasTags: true,
        isTagDown: true
    };

    constructor(props) {
        super(props);
    }

    _renderArticleTags = () => {
        return (
            <div className="article-mini-card-articleTags">
                {
                    this.props.article.tags.map((tag) => (
                        <Chip key={tag.id}
                              className="article-mini-card-articleTag"
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
            <Card id={`article-${this.props.article.id}`}
                  className={classNames('article-mini-card-card', {
                      'article-mini-card-cardPaper': this.props.isPaper,
                      'article-mini-card-cardPrivate': isPrivateInPublic
                  })}
                  component="article"
                  itemScope={true}
                  itemType="https://schema.org/BlogPosting">
                <CardHeader classes={{
                    root: 'article-mini-card-header'
                }}
                            title={
                                <h2 className="article-mini-card-extractTitle"
                                    itemProp="name headline">
                                    <Link className="article-mini-card-extractTitleLink"
                                          to={userArticlePath(this.props.article.user.slug, this.props.article.slug)}
                                          itemProp="mainEntityOfPage url"
                                          onClick={spyTrackClick.bind(null, 'article', this.props.article.id, this.props.article.slug, this.props.article.userId, this.props.article.title, this.props.article.topicId)}>
                                        {this.props.article.title}
                                    </Link>
                                </h2>
                            }
                            subheader={(this.props.hasTags && !this.props.isTagDown) && this._renderArticleTags()}
                />

                <CardContent classes={{
                    root: 'article-mini-card-articleContent'
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

                    <Grid container={true}
                          classes={{
                              container: 'article-mini-card-articleInfo'
                          }}
                          spacing={2}
                          direction="row"
                          justifyContent="flex-start"
                          alignItems="center">
                        <Grid item={true}
                              xs={this.props.article.defaultPicture ? 8 : 12}
                              className={classNames('article-mini-card-headerItem', {
                                  'article-mini-card-articleContentFaded': this.props.isFaded && contentLength > 120
                              })}
                              itemProp="articleBody">
                            <div className="normalized-content normalized-content-extract"
                                 dangerouslySetInnerHTML={{__html: this.props.article.contentSummary || this.props.article.content}}/>

                        </Grid>

                        {
                            this.props.article.defaultPicture?.webp &&
                            <Grid className="article-mini-card-headerItem"
                                  item={true}
                                  xs={4}>
                                <CardMedia className="article-mini-card-media"
                                           image={this.props.article.defaultPicture.webp}
                                           title={this.props.article.name}/>
                            </Grid>
                        }
                    </Grid>


                    <Grid container={true}
                          classes={{
                              container: 'article-mini-card-articleInfo'
                          }}
                          spacing={2}
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center">
                        <Grid item={true}
                              className="article-mini-card-headerItem">
                            <Grid container={true}
                                  classes={{
                                      container: 'article-mini-card-articleInfo'
                                  }}
                                  spacing={2}
                                  direction="row"
                                  justifyContent="flex-start"
                                  alignItems="center">
                                <Grid item={true}
                                      className="article-mini-card-headerItem">
                                    <meta itemProp="author"
                                          content={this.props.article.user.pseudo}/>

                                    <Link className="article-mini-card-userPseudo"
                                          to={userArticlesPath(this.props.article.user.slug)}
                                          onClick={spyTrackClick.bind(null, 'user', this.props.article.user.id, this.props.article.user.slug, null, this.props.article.user.pseudo, null)}>
                                        {this.props.article.user.pseudo}
                                    </Link>
                                </Grid>

                                <Grid item={true}
                                      className="article-mini-card-headerItem">
                                    <div className="article-mini-card-separator"/>
                                </Grid>

                                <Grid item={true}
                                      className="article-mini-card-headerItem">
                                    <meta itemProp="datePublished"
                                          content={this.props.article.dateIso}/>

                                    <time className="article-mini-card-date">
                                        {this.props.article.date}
                                    </time>
                                </Grid>
                            </Grid>
                        </Grid>

                        {
                            this.props.isTagDown &&
                            <Grid item={true}>
                                {this._renderArticleTags()}
                            </Grid>
                        }
                    </Grid>

                    {
                        isPrivateInPublic &&
                        <div className="article-mini-card-privateMessage">
                            {I18n.t('js.article.common.private_in_public')}
                        </div>
                    }
                </CardContent>
            </Card>
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
