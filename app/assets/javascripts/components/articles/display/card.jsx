'use strict';

import {
    Link
} from 'react-router-dom';

import Observer from '@researchgate/react-intersection-observer';

import {
    StickyContainer,
    Sticky
} from 'react-sticky';

import {
    withStyles
} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import {
    spyTrackClick,
    spyTrackView
} from '../../../actions';

import highlight from '../../modules/highlight';

import ArticleTags from '../properties/tags';
import ArticleAvatarIcon from '../icons/avatar';
import ArticleFloatingIcons from '../properties/floatingIcons';
import ArticleActions from '../properties/actions';

import styles from '../../../../jss/article/card';

export default @highlight()
@withStyles(styles)
class ArticleCardDisplay extends React.PureComponent {
    static propTypes = {
        article: PropTypes.object.isRequired,
        currentUserSlug: PropTypes.string,
        currentUserTopicSlug: PropTypes.string,
        isOwner: PropTypes.bool,
        // isOutdated: PropTypes.bool,
        isMinimized: PropTypes.bool,
        hasActions: PropTypes.bool,
        onEnter: PropTypes.func,
        onExit: PropTypes.func,
        // from highlight
        onShow: PropTypes.func,
        // from styles
        classes: PropTypes.object
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
        isMinimized: this.props.isMinimized,
        isFolded: false
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.isMinimized !== nextProps.isMinimized) {
            return {
                ...prevState,
                isMinimized: nextProps.isMinimized,
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

    _handleTitleClick = () => {
        spyTrackClick('article', this.props.article.id, this.props.article.slug, this.props.article.title);
    };

    render() {
        return (
            <StickyContainer>
                <Observer onChange={this._handleViewportChange}>
                    <Card component="article"
                          id={this.props.article.id}
                          className={classNames(this.props.classes.articleCard, {
                              [this.props.classes.outdated]: this.props.article.outdated
                          })}>
                        {
                            this.props.hasActions &&
                            <div className={this.props.classes.floatingButtons}>
                                <Sticky topOffset={-80}
                                        bottomOffset={-260}>
                                    {({style, isSticky}) => (
                                        <ArticleFloatingIcons style={style}
                                                              className={this.props.classes.floatingIcons}
                                                              isSticky={isSticky}
                                                              display="list"
                                                              size="default"
                                                              color="primary"
                                                              isOwner={this.props.isOwner}
                                                              userSlug={this.props.article.user.slug}
                                                              articleId={this.props.article.id}
                                                              articleSlug={this.props.article.slug}
                                                              articleTitle={this.props.article.title}/>
                                    )}
                                </Sticky>
                            </div>
                        }

                        <CardHeader classes={{
                                        root: this.props.classes.header
                                    }}
                                    action={
                                        <IconButton className={classNames(this.props.classes.expand, {
                                            [this.props.classes.expandOpen]: this.state.isFolded
                                        })}
                                                    aria-expanded={this.state.isFolded}
                                                    aria-label="Show more"
                                                    onClick={this._handleFoldClick}>
                                            <ExpandMoreIcon/>
                                        </IconButton>
                                    }
                                    title={
                                        <Grid container={true}
                                              classes={{
                                                  container: this.props.classes.articleInfo
                                              }}
                                              spacing={16}
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
                                    }
                                    subheader={
                                        <Link to={`/users/${this.props.article.user.slug}/articles/${this.props.article.slug}`}
                                              onClick={this._handleTitleClick}>
                                            <h1 className={this.props.classes.title}>
                                                {this.props.article.title}
                                            </h1>
                                        </Link>
                                    }/>

                        <Collapse in={!this.state.isFolded}
                                  timeout="auto"
                                  unmountOnExit={true}>
                            {
                                this.props.article.defaultPicture &&
                                <CardMedia className={this.props.classes.media}
                                           image={this.props.article.defaultPicture}
                                           title={this.props.article.name}/>
                            }

                            <CardContent classes={{
                                root: this.props.classes.content
                            }}>
                                <div className="normalized-content"
                                     dangerouslySetInnerHTML={{__html: this.props.article.content}}/>
                            </CardContent>

                            <CardActions className={this.props.classes.actions}
                                         disableActionSpacing={true}>
                                {
                                    this.props.article.tags.size > 0 &&
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
                                                    userSlug={this.props.article.user.slug}
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
            </StickyContainer>
        );
    }
}
