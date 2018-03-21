'use strict';

const Spinner = ({size, className}) => {
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

Spinner.propTypes = {
    size: PropTypes.string,
    className: PropTypes.string
};

export default Spinner;

