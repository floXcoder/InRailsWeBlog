'use strict';

import LazyLoaderFactory from './lazyLoader';

const ArticleSort = (props) => (
    <LazyLoaderFactory module={import(/* webpackChunkName: "article-sort" */ '../articles/sort')}
                       props={props}/>
);

export default ArticleSort;
