'use strict';

import '../../../stylesheets/pages/statics.scss';

function About({
                   staticContent
               }) {
    return (
        <div dangerouslySetInnerHTML={{__html: staticContent}}/>
    );
}

About.propTypes = {
    staticContent: PropTypes.string.isRequired
};

export default About;
