'use strict';

const RadioButtons = (props) => {
    return (
        <div>
            {
                Object.keys(props.buttons).map((key) =>
                    <div key={key}>
                        <input id={key}
                               type="radio"
                               name={props.group}
                               checked={props.checkedButton === key}
                               onChange={props.onRadioChanged}
                            {...props.validator}/>

                        <label htmlFor={key}>
                            {props.buttons[key]}
                        </label>
                    </div>
                )
            }
        </div>
    );
};

RadioButtons.propTypes = {
    buttons: React.PropTypes.object.isRequired,
    group: React.PropTypes.string.isRequired,
    checkedButton: React.PropTypes.string,
    onRadioChanged: React.PropTypes.func,
    validator: React.PropTypes.object
};

RadioButtons.defaultProps = {
    checkedButton: null,
    onRadioChanged: null,
    validator: null
};

module.exports = RadioButtons;

