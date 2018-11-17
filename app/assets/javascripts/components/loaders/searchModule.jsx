'use strict';

import LazyLoaderFactory from './lazyLoader';

const SearchModule = (props) => (
    <LazyLoaderFactory module={import(/* webpackPrefetch: true, webpackChunkName: "search-module" */ '../search/module')}
                       props={props}/>
);

export default SearchModule;
