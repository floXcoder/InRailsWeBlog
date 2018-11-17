'use strict';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import ArticleTags from '../properties/tags';

import CommentCountIcon from '../../comments/icons/count';

const ArticleCardSort = ({classes, article}) => (
    <div className={classes.sortingItem}>
        <Card component="article"
              className={classes.card}>
            <CardHeader classes={{
                title: classes.title
            }}
                        title={article.title}
            />

            <CardContent classes={{
                root: classes.content
            }}>
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
                    <CommentCountIcon className={classes.commentCount}
                                      commentLink={`/users/${article.user.slug}/articles/${article.slug}#article-comments-${article.id}`}
                                      commentsCount={article.commentsCount}
                                      hasIcon={false}/>
                }

                <div className="normalized-content"
                     dangerouslySetInnerHTML={{__html: article.content}}/>
            </CardContent>
        </Card>
    </div>
);

ArticleCardSort.propTypes = {
    classes: PropTypes.object.isRequired,
    article: PropTypes.object.isRequired
};

export default ArticleCardSort;
