'use strict';

import LazyLoaderFactory from './lazyLoader';

const UserHome = (props) => (
    <LazyLoaderFactory module={import(/* webpackChunkName: "user-home" */ '../users/home')}
                       props={props}/>
);

export default UserHome;
