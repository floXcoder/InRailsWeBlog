'use strict';

const UserTracking = ({tracking}) => {
    const trackerNodes = $.toMap(tracking, (index, value) => {
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
};

UserTracking.propTypes = {
    tracking: PropTypes.object.isRequired
};

export default UserTracking;
