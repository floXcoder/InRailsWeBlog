'use strict';

import LazyLoaderFactory from './lazyLoader';

const TagSort = (props) => (
    <LazyLoaderFactory module={import(/* webpackChunkName: "tag-sort" */ '../tags/sort')}
                       props={props}/>
);

export default TagSort;
