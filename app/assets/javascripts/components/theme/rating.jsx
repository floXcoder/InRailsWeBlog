'use strict';

var classname = require('classnames');

var Rating = React.createClass({
    propTypes: {
        initialRating: React.PropTypes.number,
        readOnly: React.PropTypes.bool,
        size: React.PropTypes.number,
        showClear: React.PropTypes.bool,
        onChange: React.PropTypes.func
    },

    getDefaultProps () {
        return {
            initialRating: 0,
            readOnly: false,
            size: 5,
            showClear: false,
            onChange: null
        };
    },

    getInitialState () {
        return {
            value: this.props.initialRating,
            prospectiveValue: 0
        };
    },

    anchorMode (value) {
        if (this.state.prospectiveValue > 0) {
            return (value <= this.state.prospectiveValue ? 'suggested' : 'off');
        }

        let current_value = this.props.readOnly ? this.props.initialRating : this.state.value;
        return (value <= current_value ? 'on' : 'off');
    },

    _handleMouseEnter (value, event) {
        event.preventDefault();
        this.setState({prospectiveValue: value});
    },

    _handleMouseLeave (event) {
        event.preventDefault();
        this.setState({prospectiveValue: 0});
    },

    _handleMouseClick (value, event) {
        event.preventDefault();
        this.setState({
            prospectiveValue: 0,
            value: value
        });
        this.props.onChange(value);
    },

    _renderStarItems () {
        return _.times(this.props.size, (i) => {
            let value = i + 1;
            let mode = this.anchorMode(i + 1);

            let linkClasses = classname('star-rating-star', mode);

            return (
                <div key={value}
                     className="star-rating-star-container">
                    <a ref={'s'+value}
                       className={linkClasses}
                       title={value}
                       onMouseEnter={!this.props.readOnly ? this._handleMouseEnter.bind(this, value) : null}
                       onMouseLeave={!this.props.readOnly ? this._handleMouseLeave : null}
                       onClick={!this.props.readOnly ? this._handleMouseClick.bind(this, value) : null}>
                        {(mode === 'on' || mode === 'suggested') ?
                            <i className="material-icons star-rating-star-size">star</i> :
                            <i className="material-icons star-rating-star-size">star_border</i>}
                    </a>

                </div>
            );
        });
    },

    _renderClearItem () {
        return (
            <div key={0}
                 className="star-rating-clear-container">
                <a className="star-rating-clear"
                   title="Clear"
                   href=""
                   ref="s0"
                   style={this.props.showClear ? null : {display: 'none'}}
                   onClick={!this.props.readOnly ? this._handleMouseClick.bind(this, 0) : null}>
                    Clear
                </a>
            </div>
        );
    },

    render () {
        return (
            <div className="star-rating-input">
                {this._renderClearItem()}
                {this._renderStarItems()}
            </div>
        );
    }
});

module.exports = Rating;
