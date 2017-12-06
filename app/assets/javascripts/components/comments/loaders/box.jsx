'use strict';

import {
    LazilyLoadFactory
} from '../../../loaders/hoc-loader';

const CommentLoader = ({CommentBox, ...props}) => (
    <CommentBox {...props}/>
);

CommentLoader.propTypes = {
    CommentBox: PropTypes.func
};

export default LazilyLoadFactory(CommentLoader, {
    CommentBox: () => System.import('../box')
});
