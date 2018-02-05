'use strict';

const RadioButtons = ({buttons, group, checkedButton, onChange}) => (
    <div>
        {
            Object.keys(buttons).map((key) => (
                <div key={key}>
                    <input id={key}
                           type="radio"
                           name={group}
                           checked={checkedButton === key}
                           onChange={onChange}/>

                    <label htmlFor={key}>
                        {buttons[key]}
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
    onChange: PropTypes.func
};

export default RadioButtons;
