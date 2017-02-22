'use strict';

const FixedActionButton = ({children}) => (
    <div className="fixed-action-btn horizontal click-to-toggle">
        <a className="btn-floating btn-large">
            <i className="material-icons">menu</i>
        </a>

        <ul>
            {
                React.Children.map(children, (button) =>
                    <li>
                        {button}
                    </li>
                )
            }
        </ul>
    </div>
);

FixedActionButton.propTypes = {
    children: React.PropTypes.oneOfType([
        React.PropTypes.array,
        React.PropTypes.element
    ]).isRequired
};

module.exports = FixedActionButton;
