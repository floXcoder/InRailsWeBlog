'use strict';

import {
    Link
} from 'react-router-dom';

import {
    spyTrackClick
} from '../../../actions';

import {
    getArticleIsOwner,
    getArticleIsOutdated
} from '../../../selectors';

import highlight from '../../modules/highlight';

import CountCommentIcon from '../../comments/icons/count';
import ArticleActions from '../properties/actions';
import ArticleTags from '../properties/tags';
import ArticleTime from '../properties/time';

import UserAvatarIcon from '../../users/icons/avatar';

@connect((state, props) => ({
    isOwner: getArticleIsOwner(state, props.article),
    isOutdated: getArticleIsOutdated(props.article)
}), {
})
@highlight
export default class ArticleCardDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        onBookmarkClick: PropTypes.func.isRequired,
        onEdit: PropTypes.func.isRequired,
        onVisibilityClick: PropTypes.func.isRequired,
        // From connect
        isOwner: PropTypes.bool,
        isOutdated: PropTypes.bool
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={classNames('card blog-article-item clearfix', {'article-outdated': this.props.isOutdated})}>
                <div className="card-content">
                    <div className="card-title article-title center clearfix">
                        <h1 className="article-title-card">
                            <Link to={`/article/${this.props.article.slug}`}
                                  onClick={spyTrackClick.bind(null, 'article', this.props.article.id)}>
                                {this.props.article.title}
                            </Link>
                        </h1>

                        <UserAvatarIcon user={this.props.article.user}
                                        className="article-user"/>

                        <div className="article-info right-align">
                            <ArticleTime lastUpdate={this.props.article.updatedAt}/>

                            <CountCommentIcon linkToComment={`/articles/${this.props.article.slug}`}
                                              commentsCount={this.props.article.commentsCount}/>
                        </div>
                    </div>

                    <div className="blog-article-content"
                         dangerouslySetInnerHTML={{__html: this.props.article.content}}/>
                </div>

                <div className="card-action article-action clearfix">
                    <div className="row">

                        <div className="col s12 m12 l6 md-margin-bottom-20">
                            <ArticleTags articleId={this.props.article.id}
                                         tags={this.props.article.tags}
                                         parentTagIds={this.props.article.parentTagIds}
                                         childTagIds={this.props.article.childTagIds}/>
                        </div>

                        <div className="col s12 m12 l6 right-align">
                            <ArticleActions articleId={this.props.article.id}
                                            articleSlug={this.props.article.slug}
                                            articleVisibility={this.props.article.visibility}
                                            onEdit={this.props.onEdit}
                                            onBookmarkClick={this.props.onBookmarkClick}
                                            onVisibilityClick={this.props.onVisibilityClick}
                                            isOwner={this.props.isOwner}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
