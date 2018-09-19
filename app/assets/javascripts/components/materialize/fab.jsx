'use strict';

import {
    Children
} from 'react';

export default class FixedActionButton extends React.PureComponent {
    static propTypes = {
        children: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.element
        ]).isRequired
    };

    componentDidMount() {
        const fab = document.querySelectorAll('.fixed-action-btn');
        M.FloatingActionButton.init(fab, {
            direction: 'left',
            hoverEnabled: false
        });
    }

    render() {
        return (
            <div className="fixed-action-btn click-to-toggle">
                <a className="btn-floating btn-large">
                    <span className="material-icons"
                          data-icon="menu"
                          aria-hidden="true"/>
                </a>

                <ul>
                    {
                        Children.map(this.props.children, (button) => (
                            <li>
                                {button}
                            </li>
                        ))
                    }
                </ul>
            </div>
        );
    }
}
