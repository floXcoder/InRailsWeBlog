'use strict';

import LazyLoaderFactory from './lazyLoader';

const ArticleNew = (props) => (
    <LazyLoaderFactory module={import(/* webpackChunkName: "article-new" */ '../articles/new')}
                       props={props}/>
);

export default ArticleNew;
