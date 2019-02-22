'use strict';

import BounceSpinner from './spinner/bounce';

const ProcessingButton = ({title, isButton}) => (
    <a className={classNames('spinner', {btn: isButton})}>
        {title}

        <BounceSpinner />
    </a>
);

ProcessingButton.propTypes = {
    title: PropTypes.string.isRequired,
    isButton: PropTypes.bool,
};

ProcessingButton.defaultProps = {
    isButton: true
};

export default React.memo(ProcessingButton);
