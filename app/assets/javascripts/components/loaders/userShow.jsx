'use strict';

import LazyLoaderFactory from './lazyLoader';

const UserShow = (props) => (
    <LazyLoaderFactory module={import(/* webpackChunkName: "user-show" */ '../users/show')}
                       props={props}/>
);

export default UserShow;
