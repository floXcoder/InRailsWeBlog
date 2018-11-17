'use strict';

import LazyLoaderFactory from './lazyLoader';

const HomeHome = (props) => (
    <LazyLoaderFactory module={import(/* webpackChunkName: "home-index" */ '../home/home')}
                       props={props}/>
);

export default HomeHome;
