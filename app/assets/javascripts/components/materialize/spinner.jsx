var Spinner = React.createClass({
    render: function () {
        var preloaderClasses = "preloader-wrapper active " + this.props.size;

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

