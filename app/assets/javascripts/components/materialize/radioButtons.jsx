'use strict';

const RadioButtons = (props) => (
    <div>
        {
            Object.keys(props.buttons).map((key) => (
                <div key={key}>
                    <input id={key}
                           type="radio"
                           name={props.group}
                           checked={props.checkedButton === key}
                           onChange={props.onRadioChanged}/>

                    <label htmlFor={key}>
                        {props.buttons[key]}
                    </label>
                </div>
            ))
        }
    </div>
);

RadioButtons.propTypes = {
    buttons: PropTypes.object.isRequired,
    group: PropTypes.string.isRequired,
    checkedButton: PropTypes.string,
    onRadioChanged: PropTypes.func
};

export default RadioButtons;
