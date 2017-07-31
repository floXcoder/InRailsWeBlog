'use strict';


export default class Tag extends React.Component {
    static propTypes = {
        labelField: PropTypes.string.isRequired,
        onDelete: PropTypes.func.isRequired,
        tag: PropTypes.object.isRequired,
        onClickTag: PropTypes.func,
        handleContextMenu: PropTypes.func,
        labelClass: PropTypes.string
    };

    static defaultProps = {
        labelField: 'name'
    };

    constructor(props) {
        super(props);
    }

    state = {
        hover: false
    };

    _onMouseOver = () => {
        this.setState({hover: true});
    };

    _onMouseOut = () => {
        this.setState({hover: false});
    };

    render() {
        var label = this.props.tag[this.props.labelField];
        var tagClasses = classNames(
            'tagsinput-tag',
            'waves-effect',
            'waves-light',
            'btn-small',
            'grey',
            'lighten-5',
            'black-text',
            this.props.labelClass);
        var tagLinkClasses = classNames('tagsinput-remove', {'icon-highlight': this.state.hover});

        return (
            <span className={tagClasses}
                  onClick={this.props.onClickTag}
                  onContextMenu={this.props.handleContextMenu}
                  data-name={label}>
                {label}

                <a className={tagLinkClasses}
                   onClick={this.props.onDelete}
                   onMouseOver={this._onMouseOver}
                   onMouseOut={this._onMouseOut}>
                    <i className="material-icons">clear</i>
                </a>
            </span>
        );
    }
}
