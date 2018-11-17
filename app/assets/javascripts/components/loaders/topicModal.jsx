'use strict';

import LazyLoaderFactory from './lazyLoader';

const TopicModal = (props) => (
    <LazyLoaderFactory module={import(/* webpackChunkName: "topic-new" */ '../topics/modal')}
                       props={props}/>
);

export default TopicModal;
