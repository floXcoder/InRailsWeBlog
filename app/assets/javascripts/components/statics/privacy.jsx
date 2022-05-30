'use strict';

import '../../../stylesheets/pages/statics.scss';

function Privacy({
                     staticContent
                 }) {
    return (
        <div dangerouslySetInnerHTML={{__html: staticContent}}/>
    );
}

Privacy.propTypes = {
    staticContent: PropTypes.string.isRequired
};

export default Privacy;
