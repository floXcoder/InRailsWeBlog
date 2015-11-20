"use strict";

var Spinner = React.createClass({
    propTypes: {
        size: React.PropTypes.string
    },

    getDefaultProps: function () {
        return {
            size: null
        };
    },

    render: function () {
        var preloaderClasses = "preloader-wrapper active";
        if(this.props.size) {
            preloaderClasses += " " + this.props.size;
        }

        return (
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
        );
    }
});

module.exports = Spinner;

