'use strict';

import {LazilyLoadFactory} from '../../../loaders/hoc-loader';

const CommentLoader = ({CommentBox, ...props}) => {
    return (
        <CommentBox {...props}/>
    )
};

CommentLoader.propTypes = {
    CommentBox: React.PropTypes.func
};

export default LazilyLoadFactory(CommentLoader, {
    CommentBox: () => System.import('../box')
});
