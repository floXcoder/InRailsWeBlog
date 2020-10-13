'use strict';

import {
    Link
} from 'react-router-dom';

import Observer from '@researchgate/react-intersection-observer';

import {
    withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import {
    userArticlePath
} from '../../../../constants/routesHelper';

import {
    spyTrackClick,
    spyTrackView
} from '../../../../actions';

import highlight from '../../../modules/highlight';

import ArticleTags from '../../properties/tags';
import ArticleAvatarIcon from '../../icons/avatar';

import styles from '../../../../../jss/article/summary';

export default @highlight()
@withStyles(styles)
class ArticleSummaryDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        topicVisibility: PropTypes.string,
        className: PropTypes.string,
        onEnter: PropTypes.func,
        onExit: PropTypes.func,
        // from highlight
        onShow: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    state = {
        isVisible: false
    };

    _handleViewportChange = (event) => {
        if (event.isIntersecting) {
            spyTrackView('article', this.props.article.id);

            if (!this.state.isVisible) {
                this.setState({
                    isVisible: true
                });
            }

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

    _handleTitleClick = () => {
        spyTrackClick('article', this.props.article.id, this.props.article.slug, this.props.article.title);
    };

    render() {
        return (
            <Observer onChange={this._handleViewportChange}>
                <div id={`article-${this.props.article.id}`}
                     className={classNames(this.props.className, {
                         'is-hidden': !this.state.isVisible,
                         'bounce-in': this.state.isVisible,
                         'private': this.props.topicVisibility === 'everyone' && this.props.article.visibility !== 'everyone'
                     })}
                     itemScope={true}
                     itemType="https://schema.org/BlogPosting">
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

                    <div className={this.props.classes.heading}>
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

                        <h1 className={this.props.classes.title}
                            itemProp="name headline">
                            <Link className={this.props.classes.titleLink}
                                  to={userArticlePath(this.props.article.user.slug, this.props.article.slug)}
                                  itemProp="mainEntityOfPage url"
                                  onClick={this._handleTitleClick}>
                                {this.props.article.title}
                            </Link>
                        </h1>
                    </div>

                    <div className={this.props.classes.summaryContent}
                         itemProp="articleBody">
                        <div className="normalized-content normalized-content-extract"
                             dangerouslySetInnerHTML={{__html: this.props.article.contentSummary || this.props.article.content}}/>
                    </div>

                    {
                        this.props.article.tags.length > 0 &&
                        <ArticleTags articleId={this.props.article.id}
                                     tags={this.props.article.tags}
                                     parentTagIds={this.props.article.parentTagIds}
                                     childTagIds={this.props.article.childTagIds}/>
                    }

                    <div className={this.props.classes.summaryLinkContainer}>
                        <Button className={this.props.classes.summaryLink}
                                color="primary"
                                variant="outlined"
                                size="small"
                                component={Link}
                                to={userArticlePath(this.props.article.user.slug, this.props.article.slug)}
                                onClick={this._handleTitleClick}>
                            {I18n.t('js.article.show.recommendations.show')}
                        </Button>
                    </div>

                    {
                        (this.props.topicVisibility === 'everyone' && this.props.article.visibility !== 'everyone') &&
                        <div className={this.props.classes.privateMessage}>
                            {I18n.t('js.article.common.private_in_public')}
                        </div>
                    }
                </div>
            </Observer>
        );
    }
}
