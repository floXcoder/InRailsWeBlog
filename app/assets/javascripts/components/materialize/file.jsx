'use strict';

export default class File extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        buttonName: PropTypes.string.isRequired,
        name: PropTypes.string,
        multipleId: PropTypes.number,
        placeholder: PropTypes.string,
        children: PropTypes.string,
        isDisabled: PropTypes.bool,
        isRequired: PropTypes.bool,
        isMultiple: PropTypes.bool,
        icon: PropTypes.string,
        onChange: PropTypes.func,
        onInput: PropTypes.func,
        validator: PropTypes.object
    };

    static defaultProps = {
        name: null,
        multipleId: null,
        placeholder: null,
        children: null,
        isDisabled: false,
        isRequired: false,
        isMultiple: false,
        icon: null,
        onChange: null,
        onInput: null,
        validator: null
    };

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.children !== nextProps.children;
    }

    render() {
        let id = this.props.multipleId ? this.props.id + '_' + this.props.multipleId : this.props.id;

        let name = this.props.name;
        if (!name && this.props.id.indexOf('_') !== -1) {
            if (this.props.multipleId) {
                name = this.props.id.replace('_', `[${this.props.multipleId}][`) + ']';
            } else {
                name = this.props.id.replace('_', '[') + ']';
            }
        }

        return (
            <div className="row file-field input-field">
                {
                    this.props.icon &&
                    <i className="material-icons prefix">{this.props.icon}</i>
                }

                <div className="col s12 m6 btn">
                    <span>
                        {this.props.buttonName}
                    </span>
                    <input id={id}
                           type="file"
                           name={this.props.isMultiple ? `${name}[]` : name}
                           required={this.props.isRequired}
                           disabled={this.props.isDisabled}
                           multiple={this.props.isMultiple}
                           {...this.props.validator}/>
                </div>

                <div className="col s12 m6 file-path-wrapper">
                    <input className="file-path validate"
                           type="text"
                           required={this.props.isRequired}
                           disabled={this.props.isDisabled}
                           placeholder={this.props.placeholder}/>
                </div>
            </div>
        );
    }
}

