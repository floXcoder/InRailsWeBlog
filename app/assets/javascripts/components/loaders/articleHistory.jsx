'use strict';

import LazyLoaderFactory from './lazyLoader';

const ArticleHistory = (props) => (
    <LazyLoaderFactory module={import(/* webpackChunkName: "article-history" */ '../articles/history')}
                       props={props}/>
);

export default ArticleHistory;
