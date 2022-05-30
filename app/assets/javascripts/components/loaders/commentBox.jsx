'use strict';

import LazyLoaderFactory from './lazyLoader';

function CommentBox(props) {
    return (
        <LazyLoaderFactory module={import(/* webpackChunkName: "comment-box" */ '../comments/box')}
                           props={props}/>
    );
}

export default CommentBox;
