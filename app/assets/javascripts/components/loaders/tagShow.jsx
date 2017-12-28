'use strict';

import LazyLoaderFactory from './lazyLoader';

const TagShow = (props) => (
    <LazyLoaderFactory module={import(/* webpackChunkName: "tag-show" */ '../tags/show')}
                       props={props}/>
);

export default TagShow;
