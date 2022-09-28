'use strict';

export default class Tag extends React.PureComponent {
    static propTypes = {
        value: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        isSelected: PropTypes.bool,
        isAnimated: PropTypes.bool,
        isAddable: PropTypes.bool,
        isDeletable: PropTypes.bool,
        onAdd: PropTypes.func,
        onDelete: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    _tagContent = () => {
        const content = [];
        const startIndex = this.props.text.trim().toLowerCase()
            .indexOf(this.props.value.trim().toLowerCase());
        const endIndex = startIndex + this.props.value.length;

        if (startIndex > 0) {
            content.push(
                <span key={1}
                      className="cti-tag-content--regular">
                    {this.props.text.substring(0, startIndex)}
                </span>
            );
        }

        content.push(
            <span key={2}
                  className="cti-tag-content-match">
              {this.props.text.substring(startIndex, endIndex)}
            </span>
        );

        if (endIndex < this.props.text.length) {
            content.push(
                <span key={3}
                      className="cti-tag-content--regular">
                    {this.props.text.substring(endIndex)}
                </span>
            );
        }

        return content;
    };

    _onClick = (event) => {
        event.preventDefault();

        if (this.props.isAddable && this.props.onAdd) {
            this.props.onAdd(event);
        }
    };

    _onDelete = (event) => {
        // Prevents onClick event of the whole tag from being triggered
        event.preventDefault();
        event.stopPropagation();

        this.props.onDelete(event);
    };

    render() {
        return (
            <div className={classNames('cti-tag', {
                'cti-selected': this.props.isSelected,
                'cti-tag-animation': this.props.isAnimated
            })}
                 onClick={this._onClick}>
                <div className="cti-tag-content">
                    {this._tagContent()}
                </div>

                {
                    !!this.props.isDeletable &&
                    <span className="cti-tag-delete"
                          onClick={this._onDelete}
                          dangerouslySetInnerHTML={{__html: '&times;'}}/>
                }
            </div>
        );
    }
}
