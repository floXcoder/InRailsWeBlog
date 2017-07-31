'use strict';

import _ from 'lodash';

export default class PictureSlider extends React.PureComponent {
    static propTypes = {
        id: PropTypes.string.isRequired,
        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.string),
            PropTypes.arrayOf(PropTypes.object)
        ]).isRequired,
        hasIndicators: PropTypes.bool,
        height: PropTypes.number,
        interval: PropTypes.number
    };

    static defaultProps = {
        hasIndicators: true,
        height: 400,
        interval: 6000
    };

    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        $('#' + this.props.id).find('.slider').slider();
    }

    render() {
        return (
            <div id={this.props.id}>
                <div className="slider">
                    <ul className="slides">
                        {
                            _.map(this.props.children, (picture, i) =>
                                <li key={i}>
                                    <img className="img-helper"
                                         src={picture}/>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>
        );
    }

// <div className="caption center-align">
//     <h3>
//         This is our big Tagline!
//     </h3>
//     <h5 className="light grey-text text-lighten-3">
//         Here's our small slogan.
//     </h5>
// </div>
}


