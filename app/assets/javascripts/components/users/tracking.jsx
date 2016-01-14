'use strict';

var UserTracking = React.createClass({
    propTypes: {
        tracking: React.PropTypes.object.isRequired
    },

    getDefaultProps () {
        return {};
    },

    render () {
        let trackerNodes = $.toMap(this.props.tracking, function(index, value) {
            return (
                <div key={index}
                     className="col s12 m6">
                    <strong className="tracking-number">
                        {value}
                    </strong>
                    <h5 className="tracking-name">
                        {I18n.t('js.tracking.' + index)}
                    </h5>
                </div>
            );
        });

        return (
            <div className="user-tracking row center-align">
                {trackerNodes}
            </div>
        );
    }
});

module.exports = UserTracking;
