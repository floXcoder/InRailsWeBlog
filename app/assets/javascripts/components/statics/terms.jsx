import PropTypes from 'prop-types';

import '@/entrypoints/stylesheets/statics.scss';

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
