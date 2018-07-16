'use strict';

import {
    Link
} from 'react-router-dom';

import Waypoint from 'react-waypoint';

import {
    StickyContainer,
    Sticky
} from 'react-sticky';

import {
    spyTrackClick,
    spyTrackView
} from '../../../actions';

import highlight from '../../modules/highlight';

import ArticleTags from '../properties/tags';
import ArticleTime from '../properties/time';
import ArticleUserIcon from '../icons/user';
import ArticleFloatingIcons from '../properties/floatingIcons';
import ArticleActions from '../properties/actions';

import CommentCountIcon from '../../comments/icons/count';

import Collapsible from '../../theme/collapsible';

@highlight()
export default class ArticleCardDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        isOwner: PropTypes.bool,
        isOutdated: PropTypes.bool,
        isMasonry: PropTypes.bool,
        isMinimized: PropTypes.bool,
        hasActions: PropTypes.bool,
        onInlineEdit: PropTypes.func,
        onClick: PropTypes.func,
        onShow: PropTypes.func
    };

    static defaultProps = {
        isOwner: false,
        isOutdated: false,
        isMasonry: false,
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

    _handleWaypointEnter = () => {
        spyTrackView('article', this.props.article.id);

        if (this.props.onShow) {
            this.props.onShow(this.props.article.id);
        }
    };

    _handleFoldClick = (event) => {
        event.preventDefault();

        if (this.props.isMasonry) {
            this.props.onClick();
        } else {
            this.setState({
                isFolded: !this.state.isFolded
            });
        }
    };

    render() {
        return (
            <StickyContainer>
                <div className="article-item">
                    <Waypoint onEnter={this._handleWaypointEnter}/>

                    <div className="article-floating-container">
                        <Sticky topOffset={-50}
                                bottomOffset={-160}>
                            {({style, isSticky}) => (
                                <ArticleFloatingIcons style={style}
                                                      isSticky={isSticky}
                                                      articleId={this.props.article.id}
                                                      articleSlug={this.props.article.slug}
                                                      articleTitle={this.props.article.title}/>
                            )}
                        </Sticky>
                    </div>

                    <div className={classNames('article-content', {
                             'article-outdated': this.props.article.outdated
                         })}>
                        {
                            this.props.article.title &&
                            <div className="article-title">
                                <Link to={`/article/${this.props.article.slug}`}
                                      onClick={spyTrackClick.bind(null, 'article', this.props.article.id, this.props.article.slug, this.props.article.title)}>
                                    <h2 className="title">
                                        {this.props.article.title}
                                    </h2>
                                </Link>

                                <span className="article-collapsible-button">
                                    <a href="#"
                                       onClick={this._handleFoldClick}>
                                       {
                                           this.props.isMasonry
                                               ?
                                               <span className="material-icons"
                                                     data-icon="fullscreen_exit"
                                                     aria-hidden="true"/>
                                               :
                                               this.state.isFolded
                                                   ?
                                                   <span className="material-icons"
                                                         data-icon="vertical_align_bottom"
                                                         aria-hidden="true"/>
                                                   :
                                                   <span className="material-icons"
                                                         data-icon="vertical_align_center"
                                                         aria-hidden="true"/>
                                       }
                                    </a>
                                </span>
                            </div>
                        }

                        {
                            (!this.props.article.title && this.props.isMasonry) &&
                            <span className="article-collapsible-button article-no-title">
                            <a href="#"
                               onClick={this._handleFoldClick}>
                               <span className="material-icons"
                                     data-icon="fullscreen_exit"
                                     aria-hidden="true"/>
                            </a>
                        </span>
                        }

                        <Collapsible isDefaultOpen={true}
                                     isForceOpen={!this.state.isFolded}
                                     className="article-collapsible">
                            <div className="article-info">
                                <div className="blog-article-info">
                                    <ArticleUserIcon user={this.props.article.user}/>

                                    <span className="blog-article-info-sep">|</span>

                                    <ArticleTime articleDate={this.props.article.date}/>

                                    {
                                        this.props.article.visibility === 'everyone' &&
                                        <CommentCountIcon
                                            commentLink={`/article/${this.props.article.slug}#article-comments-${this.props.article.id}`}
                                            commentsCount={this.props.article.commentsCount}
                                            hasIcon={false}/>
                                    }
                                </div>
                            </div>

                            <div className="blog-article-content"
                                 dangerouslySetInnerHTML={{__html: this.props.article.content}}/>

                            {
                                this.props.article.tags.size > 0 &&
                                <div className="blog-article-info">
                                    <ArticleTags articleId={this.props.article.id}
                                                 tags={this.props.article.tags}
                                                 parentTagIds={this.props.article.parentTagIds}
                                                 childTagIds={this.props.article.childTagIds}/>
                                </div>
                            }

                            {
                                this.props.isOwner &&
                                <div className="article-actions">
                                    <div className="article-actions-text">
                                        {I18n.t('js.article.common.actions')}
                                    </div>

                                    <ArticleActions isInline={true}
                                                    articleId={this.props.article.id}
                                                    articleSlug={this.props.article.slug}
                                                    articleTitle={this.props.article.title}
                                                    articleVisibility={this.props.article.visibility}
                                                    isOutdated={this.props.article.outdated}
                                                    isBookmarked={this.props.article.bookmarked}/>
                                </div>
                            }
                        </Collapsible>
                    </div>
                </div>
            </StickyContainer>
        );
    }
}
