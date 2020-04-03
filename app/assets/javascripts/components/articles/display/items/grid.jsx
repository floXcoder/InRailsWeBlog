'use strict';

import {
    Link
} from 'react-router-dom';

import Observer from '@researchgate/react-intersection-observer';

import {
    withStyles
} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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

import styles from '../../../../../jss/article/card';

export default @highlight()
@withStyles(styles)
class ArticleGridDisplay extends React.PureComponent {
    static propTypes = {
        article: PropTypes.object.isRequired,
        currentUserSlug: PropTypes.string,
        currentUserTopicSlug: PropTypes.string,
        isOwner: PropTypes.bool,
        isMinimized: PropTypes.bool,
        onEnter: PropTypes.func,
        onExit: PropTypes.func,
        // from highlight
        onShow: PropTypes.func,
        // from styles
        classes: PropTypes.object
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

    _handleViewportChange = event => {
        if (event.isIntersecting) {
            spyTrackView('article', this.props.article.id);

            if (this.props.onShow) {
                this.props.onShow(this.props.article.id);
            }

            if (this.props.onEnter) {
                this.props.onEnter(this.props.article);
            }
        } else {
            if (this.props.onExit) {
                this.props.onExit(this.props.article);
            }
        }
    };

    _handleFoldClick = (event) => {
        event.preventDefault();

        this.setState({
            isFolded: !this.state.isFolded
        });
    };

    render() {
        const isInventoryMode = this.props.article.mode === 'inventory';

        return (
            <Observer onChange={this._handleViewportChange}>
                <Card component="article"
                      id={`article-${this.props.article.id}`}
                      className={this.props.classes.card}
                      itemScope={true}
                      itemType="https://schema.org/BlogPosting">
                    <CardHeader classes={{
                        root: classNames({
                            [this.props.classes.outdated]: this.props.article.outdated
                        }),
                        content: this.props.classes.cardHeader
                    }}
                                action={
                                    !isInventoryMode
                                        ?
                                        <IconButton className={classNames(this.props.classes.expand, {
                                            [this.props.classes.expandOpen]: this.state.isFolded
                                        })}
                                                    aria-expanded={this.state.isFolded}
                                                    aria-label="Show more"
                                                    onClick={this._handleFoldClick}>
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
                                                  container: this.props.classes.articleInfo
                                              }}
                                              spacing={2}
                                              direction="row"
                                              justify="space-between"
                                              alignItems="center">
                                            <Grid classes={{
                                                item: this.props.classes.infoItem
                                            }}
                                                  item={true}>
                                                <ArticleAvatarIcon classes={this.props.classes}
                                                                   user={this.props.article.user}
                                                                   articleDate={this.props.article.date}/>
                                            </Grid>
                                        </Grid>
                                        :
                                        null
                                }
                                subheader={
                                    <Typography component="h1"
                                                className={this.props.classes.gridTitle}
                                                noWrap={true}
                                                itemProp="name headline">
                                        <Link className={this.props.classes.gridTitleLink}
                                              to={userArticlePath(this.props.article.user.slug, this.props.article.slug)}
                                              itemProp="mainEntityOfPage url"
                                              onClick={spyTrackClick.bind(null, 'article', this.props.article.id, this.props.article.slug, this.props.article.title)}>
                                            {this.props.article.title}
                                        </Link>
                                    </Typography>
                                }/>

                    <Collapse in={!this.state.isFolded}
                              timeout="auto"
                              unmountOnExit={true}>
                        <CardContent classes={{
                            root: this.props.classes.content
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

                        <CardActions className={this.props.classes.actions}
                                     disableSpacing={true}>
                            {
                                this.props.article.tags.length > 0 &&
                                <ArticleTags articleId={this.props.article.id}
                                             tags={this.props.article.tags}
                                             currentUserSlug={this.props.currentUserSlug}
                                             currentUserTopicSlug={this.props.currentUserTopicSlug}
                                             parentTagIds={this.props.article.parentTagIds}
                                             childTagIds={this.props.article.childTagIds}/>
                            }

                            {
                                this.props.isOwner &&
                                <ArticleActions classes={this.props.classes}
                                                isInline={true}
                                                userSlug={this.props.currentUserSlug}
                                                articleId={this.props.article.id}
                                                articleSlug={this.props.article.slug}
                                                articleTitle={this.props.article.title}
                                                articleVisibility={this.props.article.visibility}
                                                isOutdated={this.props.article.outdated}/>
                            }
                        </CardActions>
                    </Collapse>
                </Card>
            </Observer>
        );
    }
}
