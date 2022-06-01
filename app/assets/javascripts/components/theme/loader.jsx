'use strict';

function Loader({
                    size,
                    className
                }) {
    return (
        <div className={classNames(
            'donut',
            size,
            className
        )}/>
    );
}

Loader.propTypes = {
    size: PropTypes.oneOf(['small', 'big']),
    className: PropTypes.string
};

export default React.memo(Loader);

