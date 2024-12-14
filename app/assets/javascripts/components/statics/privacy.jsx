import PropTypes from 'prop-types';

import '@/entrypoints/stylesheets/statics.scss';

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
