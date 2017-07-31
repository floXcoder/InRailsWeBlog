'use strict';

const CircleSpinner = ({size, className}) => {
    const preloaderClasses = classNames(
        'preloader-wrapper',
        'active',
        size
    );

    return (
        <div className={className}>
            <div className={preloaderClasses}>
                <div className="spinner-layer spinner-blue-only">
                    <div className="circle-clipper left">
                        <div className="circle"/>
                    </div>
                    <div className="gap-patch">
                        <div className="circle"/>
                    </div>
                    <div className="circle-clipper right">
                        <div className="circle"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

CircleSpinner.propTypes = {
    size: PropTypes.string,
    className: PropTypes.string
};

CircleSpinner.defaultProps = {
    size: null,
    className: null
};

export default CircleSpinner;
