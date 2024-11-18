'use strict';

import {
    Link
} from 'react-router-dom';

import {InView} from 'react-intersection-observer';

import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';

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


export default @highlight()
class ArticleSummaryDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        topicVisibility: PropTypes.string,
        className: PropTypes.string,
        onEnter: PropTypes.func,
        onExit: PropTypes.func,
        // from highlight
        onShow: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    state = {
        isVisible: false
    };

    _handleViewportChange = (inView, intersectionObserverEntry) => {
        if (intersectionObserverEntry.isIntersecting) {
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
        } else if (this.props.onExit) {
            this.props.onExit(this.props.article);
        }
    };

    _handleTitleClick = () => {
        spyTrackClick('article', this.props.article.id, this.props.article.slug, this.props.article.userId, this.props.article.title, this.props.article.topicId);
    };

    render() {
        return (
            <InView onChange={this._handleViewportChange}
                    rootMargin="-50px">
                <div id={`article-${this.props.article.id}`}
                     className={classNames(this.props.className, {
                         'is-hidden': !this.state.isVisible && !window.seoMode,
                         'bounce-in': this.state.isVisible,
                         private: this.props.topicVisibility === 'everyone' && this.props.article.visibility !== 'everyone'
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

                    <div className="article-summary-heading">
                        <Grid container={true}
                              classes={{
                                  container: 'article-summary-article-info'
                              }}
                              spacing={2}
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center">
                            <Grid classes={{
                                item: 'article-summary-info-item'
                            }}
                                  >
                                <ArticleAvatarIcon user={this.props.article.user}
                                                   createdDate={this.props.article.date}
                                                   updatedDate={this.props.article.updatedDate}/>
                            </Grid>
                        </Grid>

                        <h1 className="article-summary-title"
                            itemProp="name headline">
                            <Link className="article-summary-title-link"
                                  to={userArticlePath(this.props.article.user.slug, this.props.article.slug)}
                                  itemProp="mainEntityOfPage url"
                                  onClick={this._handleTitleClick}>
                                {this.props.article.title}
                            </Link>
                        </h1>
                    </div>

                    <div className="article-summary-summary-content"
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

                    <div className="article-summary-summary-link-container">
                        <Button className="article-summary-summary-link"
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
                        <div className="article-summary-private-message">
                            {I18n.t('js.article.common.private_in_public')}
                        </div>
                    }
                </div>
            </InView>
        );
    }
}
