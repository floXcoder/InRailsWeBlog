'use strict';

import Tag from './tag';


export default class CategorizedInput extends React.Component {
    static propTypes = {
        openPanel: PropTypes.func.isRequired,
        closePanel: PropTypes.func.isRequired,
        onValueChange: PropTypes.func.isRequired,
        onTagDeleted: PropTypes.func.isRequired,
        onKeyDown: PropTypes.func.isRequired,
        value: PropTypes.string.isRequired,
        selectedTags: PropTypes.arrayOf(PropTypes.object).isRequired,
        id: PropTypes.string,
        name: PropTypes.string,
        animateTagValue: PropTypes.string,
        placeholder: PropTypes.string,
        placeholderWithTags: PropTypes.string,
        onBlur: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    focusInput = () => {
        this._input.focus();
    };

    getSelectedTags = () => {
        return this.props.selectedTags.map((tag, i) => {
            return (
                <Tag key={`${tag.value}_${i}`}
                     value=""
                     text={tag.value}
                     selected={false}
                     isAddable={false}
                     isDeletable={true}
                     isAnimated={this.props.animateTagValue === tag.value}
                     onDelete={this.props.onTagDeleted.bind(this, i)}/>
            );
        });
    };

    _onBlur = (event) => {
        this.props.closePanel();

        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
    };

    render() {
        const size = this.props.value.length === 0 ?
            this.props.placeholder.length :
            this.props.value.length;

        const placeholder = this.props.selectedTags.length > 0 && this.props.placeholderWithTags ? this.props.placeholderWithTags : this.props.placeholder;

        return (
            <div className="cti-input"
                 onClick={this.focusInput}>

                {this.getSelectedTags()}

                <input ref={(input) => this._input = input}
                       type="text"
                       id={this.props.id}
                       className="cti-input-input"
                       name={this.props.name}
                       value={this.props.value}
                       size={size + 2}
                       onFocus={this.props.openPanel}
                       onBlur={this._onBlur}
                       onChange={this.props.onValueChange}
                       onKeyDown={this.props.onKeyDown}
                       placeholder={placeholder}
                       aria-label={placeholder}/>
                {
                    this.props.value.length > 0 &&
                    <div className="cti-input-arrow"/>
                }
            </div>
        );
    }
}
