'use strict';

import LazyLoaderFactory from './lazyLoader';

const TagEdit = (props) => (
    <LazyLoaderFactory module={import(/* webpackChunkName: "tag-edit" */ '../tags/edit')}
                       props={props}/>
);

export default TagEdit;
