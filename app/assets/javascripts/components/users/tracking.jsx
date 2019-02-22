'use strict';

const UserTracking = ({tracking}) => (
    <div className="user-tracking row center-align">
        {
            Utils.toMap(tracking, (index, value) => (
                <div key={index}
                     className="col s12 m6">
                    <strong className="tracking-number">
                        {value}
                    </strong>
                    <h5 className="tracking-name">
                        {I18n.t(`js.tracker.${index}`)}
                    </h5>
                </div>
            ))
        }
    </div>
);

UserTracking.propTypes = {
    tracking: PropTypes.object.isRequired
};

export default React.memo(UserTracking);
