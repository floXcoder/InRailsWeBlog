'use strict';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import {
    userArticlePath
} from '../../../constants/routesHelper';

import ArticleInventoryDisplay from '../display/items/inventory';
import ArticleTags from '../properties/tags';

import CommentCountIcon from '../../comments/icons/count';


const ArticleCardSort = function ({article}) {
    return (
        <div className="article-sort-sorting-item">
            <Card component="article"
                  className="article-sort-card">
                <CardHeader classes={{
                    root: 'article-sort-card-header',
                    title: 'article-sort-card-title'
                }}
                            title={article.title}/>

                <CardContent classes={{
                    root: 'article-sort-card-content'
                }}>
                    {
                        article.tags.length > 0 &&
                        <ArticleTags articleId={article.id}
                                     tags={article.tags}
                                     parentTagIds={article.parentTagIds}
                                     childTagIds={article.childTagIds}
                                     hasTooltip={false}
                                     isSmall={true}/>
                    }

                    {
                        (article.visibility === 'everyone' && article.commentsCount > 0) &&
                        <CommentCountIcon className="article-sort-comment-count"
                                          commentLink={userArticlePath(article.user.slug, article.slug) + `#article-comments-${article.id}`}
                                          commentsCount={article.commentsCount}
                                          hasIcon={false}/>
                    }

                    {
                        article.mode === 'inventory'
                            ?
                            <ArticleInventoryDisplay isList={true}
                                                     inventories={article.inventories}/>
                            :
                            <div className="normalized-content"
                                 dangerouslySetInnerHTML={{__html: article.content}}/>
                    }
                </CardContent>
            </Card>
        </div>
    );
};

ArticleCardSort.propTypes = {
    article: PropTypes.object.isRequired
};

export default React.memo(ArticleCardSort);
