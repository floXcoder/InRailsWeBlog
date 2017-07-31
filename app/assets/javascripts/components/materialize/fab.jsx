'use strict';

const FixedActionButton = ({children}) => (
    <div className="fixed-action-btn horizontal click-to-toggle">
        <a className="btn-floating btn-large">
            <i className="material-icons">menu</i>
        </a>
        <ul>
            {
                React.Children.map(children, (button) => {
                    return (
                        <li>
                            {button}
                        </li>
                    );
                })
            }
        </ul>
    </div>
);

FixedActionButton.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.element
    ]).isRequired
};

export default FixedActionButton;
