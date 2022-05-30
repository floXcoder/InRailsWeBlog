'use strict';

import '../../../stylesheets/pages/statics.scss';

function Terms({
                   staticContent
               }) {
    return (
        <div dangerouslySetInnerHTML={{__html: staticContent}}/>
    );
}

Terms.propTypes = {
    staticContent: PropTypes.string.isRequired
};

export default Terms;
