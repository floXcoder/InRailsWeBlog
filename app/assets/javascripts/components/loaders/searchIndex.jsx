'use strict';

import LazyLoaderFactory from './lazyLoader';

const SearchIndex = (props) => (
    <LazyLoaderFactory module={import(/* webpackPrefetch: true, webpackChunkName: "search-index" */ '../search/index')}
                       props={props}/>
);

export default SearchIndex;
