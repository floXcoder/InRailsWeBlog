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
        onInput: PropTypes.func
    };

    static defaultProps = {
        isDisabled: false,
        isRequired: false,
        isMultiple: false
    };

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps) {
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
                    <span className="material-icons prefix"
                          data-icon={this.props.icon}
                          aria-hidden="true"/>
                }

                <div className="col s12 m6">
                    <div className="btn">
                        <span>
                            {this.props.buttonName}
                        </span>
                        <input id={id}
                               type="file"
                               name={this.props.isMultiple ? `${name}[]` : name}
                               required={this.props.isRequired}
                               disabled={this.props.isDisabled}
                               multiple={this.props.isMultiple}/>
                    </div>
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

