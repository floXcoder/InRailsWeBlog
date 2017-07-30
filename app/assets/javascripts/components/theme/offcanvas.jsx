'use strict';

import _ from 'lodash';

export default class OffCanvas extends React.PureComponent {
    static propTypes = {
        onToggle: React.PropTypes.func
    };

    static defaultProps = {
        onToggle: null
    };

    state = {
        deployed: false
    };

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.state.deployed, nextState.deployed);
    }

    _handleToggleClick = (event) => {
        event.preventDefault();
        this.setState({deployed: !this.state.deployed});
        this.props.onToggle();
    };

    render() {
        return (
            <p className="offcanvas-button">
                <a className="waves-effect waves-light btn-flat"
                   data-toggle="offcanvas"
                   onClick={this._handleToggleClick}>
                    {
                        this.state.deployed
                            ?
                            <i className="material-icons">chevron_left</i>
                            :
                            <i className="material-icons">chevron_right</i>
                    }
                </a>
            </p>
        );
    }
}

