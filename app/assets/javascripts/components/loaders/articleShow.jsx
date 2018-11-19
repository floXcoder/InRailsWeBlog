'use strict';

import LazyLoaderFactory from './lazyLoader';

const ArticleShow = (props) => (
    <LazyLoaderFactory module={import(/* webpackPrefetch: true, webpackChunkName: "article-show" */ '../articles/show')}
                       props={props}/>
);

export default ArticleShow;
