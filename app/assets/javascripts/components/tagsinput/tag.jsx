'use strict';


export default class Tag extends React.Component {
    static propTypes = {
        labelField: React.PropTypes.string.isRequired,
        onDelete: React.PropTypes.func.isRequired,
        tag: React.PropTypes.object.isRequired,
        onClickTag: React.PropTypes.func,
        handleContextMenu: React.PropTypes.func,
        labelClass: React.PropTypes.string
    };

    static defaultProps = {
        labelField: 'name'
    };

    state = {
        hover: false
    };

    constructor(props) {
        super(props);
    }

    _onMouseOver() {
        this.setState({hover: true});
    }

    _onMouseOut() {
        this.setState({hover: false});
    }

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
