'use strict';

import LazyLoaderFactory from './lazyLoader';

const TagIndex = (props) => (
    <LazyLoaderFactory module={import(/* webpackChunkName: "tag-index" */ '../tags/index')}
                       props={props}/>
);

export default TagIndex;
