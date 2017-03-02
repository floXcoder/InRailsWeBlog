'use strict';

export default class Rating extends React.PureComponent {
    static propTypes = {
        initialRating: React.PropTypes.number,
        ratingCount: React.PropTypes.number,
        isReadOnly: React.PropTypes.bool,
        starNumber: React.PropTypes.number,
        hasClear: React.PropTypes.bool,
        isCentered: React.PropTypes.bool,
        onChange: React.PropTypes.func,
        hasInput: React.PropTypes.bool,
        inputId: React.PropTypes.string,
        inputName: React.PropTypes.string,
        size: React.PropTypes.oneOf(['small', 'normal', 'big']),
        labelName: React.PropTypes.string
    };

    static defaultProps = {
        initialRating: 0,
        ratingCount: null,
        isReadOnly: true,
        starNumber: 5,
        hasClear: false,
        isCentered: false,
        onChange: null,
        hasInput: false,
        inputId: null,
        inputName: null,
        size: 'normal',
        labelName: null
    };

    state = {
        value: this.props.initialRating,
        prospectiveValue: 0
    };

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(this.state, nextState);
    }

    anchorMode = (value) => {
        if (this.state.prospectiveValue > 0) {
            return (value <= this.state.prospectiveValue ? 'suggested' : 'off');
        }

        let current_value = this.props.isReadOnly ? this.props.initialRating : this.state.value;
        return (value <= current_value ? 'on' : 'off');
    };

    _handleMouseEnter = (value, event) => {
        event.preventDefault();
        this.setState({prospectiveValue: value});
    };

    _handleMouseLeave = (event) => {
        event.preventDefault();
        this.setState({prospectiveValue: 0});
    };

    _handleMouseClick = (value, event) => {
        event.preventDefault();

        this.setState({
            prospectiveValue: 0,
            value: value
        });

        if (this.props.hasInput && this.props.inputId) {
            this.refs.ratingInput.value = value;
        }

        if (this.props.onChange) {
            this.props.onChange(value);
        }
    };

    value = () => {
        return this.state.value;
    };

    setValue = (value) => {
        this.setState({
            value: value
        });
    };

    render() {
        const starRatingClass = classNames(
            'star-rating-input',
            {
                'star-rating-center': this.props.isCentered,
                'star-rating-editable': !this.props.isReadOnly
            }
        );

        let name = this.props.inputName;
        if (this.props.hasInput && this.props.inputId) {
            if (!name && this.props.inputId.indexOf('_') !== -1) {
                name = this.props.inputId.replace('_', '[') + ']';
            }
        }

        return (
            <div className="star-rating">
                {
                    this.props.hasInput &&
                    <label htmlFor={this.props.inputId}>
                        {this.props.labelName}
                    </label>
                }

                <div className={starRatingClass}>
                    <div className="star-rating-clear-container">
                        <a className="star-rating-clear"
                           title="Clear"
                           href=""
                           ref="s0"
                           style={this.props.hasClear ? null : {display: 'none'}}
                           onClick={!this.props.isReadOnly ? this._handleMouseClick.bind(this, 0) : null}>
                            {I18n.t('js.rating.clear')}
                        </a>
                    </div>

                    {/*<meta itemProp="ratingValue"*/
                        /*content={this.props.initialRating}/>*/}

                    {
                        /*this.props.ratingCount &&*/
                        /*<meta itemProp="reviewCount"*/
                        /*content={this.props.ratingCount}/>*/
                    }

                    {
                        _.times(this.props.starNumber, (i) => {
                            let value = i + 1;
                            let mode = this.anchorMode(i + 1);

                            let linkClasses = classNames('star-rating-star', mode);
                            let starClasses = classNames('material-icons star-rating-star-size', this.props.size);

                            return (
                                <div key={i}
                                     className="star-rating-star-container">
                                    <a ref={'s' + value}
                                       className={linkClasses}
                                       title={value}
                                       onMouseEnter={!this.props.isReadOnly ? this._handleMouseEnter.bind(this, value) : null}
                                       onMouseLeave={!this.props.isReadOnly ? this._handleMouseLeave : null}
                                       onClick={!this.props.isReadOnly ? this._handleMouseClick.bind(this, value) : null}>
                                        {(mode === 'on' || mode === 'suggested') ?
                                            <i className={starClasses}>star</i> :
                                            <i className={starClasses}>star_border</i>}
                                    </a>
                                </div>
                            );
                        })
                    }

                    {
                        this.props.hasInput &&
                        <input ref="ratingInput"
                               id={this.props.inputId}
                               name={name}
                               type="hidden"/>
                    }
                </div>
            </div>
        );
    }
}

