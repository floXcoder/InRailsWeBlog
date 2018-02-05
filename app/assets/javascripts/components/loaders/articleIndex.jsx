'use strict';

import LazyLoaderFactory from './lazyLoader';

const ArticleIndex = (props) => (
    <LazyLoaderFactory module={import(/* webpackChunkName: "article-index" */ '../articles/index')}
                       props={props}/>
);

export default ArticleIndex;
