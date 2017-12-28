'use strict';

import LazyLoaderFactory from './lazyLoader';

const UserEdit = (props) => (
    <LazyLoaderFactory module={import(/* webpackChunkName: "user-edit" */ '../users/edit')}
                       props={props}/>
);

export default UserEdit;
