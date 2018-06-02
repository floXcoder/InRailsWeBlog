'use strict';

import ArticleTags from '../properties/tags';

import CommentCountIcon from '../../comments/icons/count';

const ArticleCardSort = ({article}) => (
    <div className="article-item article-sort-item">
        <div className="article-content">
            <div className="article-title">
                <h2 className="title">
                    {article.title}
                </h2>

                <div className="blog-article-info">
                    {
                        article.tags.size > 0 &&
                        <ArticleTags articleId={article.id}
                                     tags={article.tags}
                                     parentTagIds={article.parentTagIds}
                                     childTagIds={article.childTagIds}
                                     hasTooltip={false}/>
                    }

                    {
                        (article.visibility === 'everyone' && article.commentsCount > 0) &&
                        <CommentCountIcon commentLink={`/article/${article.slug}#article-comments-${article.id}`}
                                          commentsCount={article.commentsCount}
                                          hasIcon={false}/>
                    }
                </div>
            </div>

            <div className="blog-article-content"
                 dangerouslySetInnerHTML={{__html: article.content}}/>
        </div>
    </div>
);

ArticleCardSort.propTypes = {
    article: PropTypes.object.isRequired
};

export default ArticleCardSort;
