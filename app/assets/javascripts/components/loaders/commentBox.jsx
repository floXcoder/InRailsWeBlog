'use strict';

import LazyLoaderFactory from './lazyLoader';

const CommentBox = (props) => (
    <LazyLoaderFactory module={import(/* webpackChunkName: "comment-box" */ '../comments/box')}
                       props={props}/>
);

export default CommentBox;
