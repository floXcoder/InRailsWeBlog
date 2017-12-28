'use strict';

import LazyLoaderFactory from './lazyLoader';

const ArticleEdit = (props) => (
    <LazyLoaderFactory module={import(/* webpackChunkName: "article-edit" */ '../articles/edit')}
                       props={props}/>
);

export default ArticleEdit;
