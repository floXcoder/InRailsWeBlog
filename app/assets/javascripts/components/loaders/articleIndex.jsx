'use strict';

import LazyLoaderFactory from './lazyLoader';

const ArticleIndex = (props) => (
    <LazyLoaderFactory module={import(/* webpackPrefetch: true, webpackChunkName: "article-index" */ '../articles/index')}
                       props={props}/>
);

export default ArticleIndex;
