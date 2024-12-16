import PropTypes from 'prop-types';

import '@/entrypoints/stylesheets/statics.scss';

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
