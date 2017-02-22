'use strict';

const classNames = require('classnames');

var Submit = ({id, children, isDisabled, tooltipMessage, onClick}) => (
    <input id={id}
           disabled={isDisabled}
           className={classNames('btn', {
               tooltipped: !$.isEmpty(tooltipMessage),
               disabled: isDisabled
           })}
           data-position="top"
           data-delay="50"
           data-tooltip={tooltipMessage}
           type="submit"
           value={children}
           onClick={onClick}
           name="commit"/>
);

Submit.propTypes = {
    id: React.PropTypes.string.isRequired,
    children: React.PropTypes.string.isRequired,
    isDisabled: React.PropTypes.bool,
    tooltipMessage: React.PropTypes.string,
    onClick: React.PropTypes.func
};

Submit.defaultProps = {
    isDisabled: false,
    tooltipMessage: null,
    onClick: null
};

module.exports = Submit;
