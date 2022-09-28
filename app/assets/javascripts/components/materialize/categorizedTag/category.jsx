'use strict';

import Tag from './tag';


export default class Category extends React.Component {
    static propTypes = {
        items: PropTypes.array.isRequired,
        category: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]).isRequired,
        title: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        selectedItem: PropTypes.number.isRequired,
        value: PropTypes.string.isRequired,
        overhead: PropTypes.number,
        hasAddNew: PropTypes.bool,
        addNewPlaceholder: PropTypes.string,
        addNewValue: PropTypes.string,
        type: PropTypes.string,
        onAdd: PropTypes.func.isRequired,
        isSingle: PropTypes.bool
    };

    constructor(props) {
        super(props);
    }

    _onAdd = (value, isNew) => {
        return () => this.props.onAdd({
            category: this.props.category,
            value: value,
            isNew: isNew
        });
    };

    _onCreateNew = (event) => {
        event.preventDefault();

        this._onAdd(this.props.value, true)();
    };

    itemToTag = (value, i) => {
        if (this.props.overhead && i === this.props.overhead) {
            return (
                <div key={`${value}_${i}`}
                     className="cti-tag-overhead">
                    {value}
                </div>
            );
        } else {
            return (
                <Tag key={`${value}_${i}`}
                     isSelected={this._isSelected(i)}
                     value={this.props.value}
                     text={value}
                     isAddable={true}
                     isDeletable={false}
                     onAdd={this._onAdd(value, false)}/>
            );
        }
    };

    fullMatchInItems = () => {
        this.props.items.map((item) => {
            if (item === this.props.value) {
                return true;
            } else {
                return false;
            }
        });

        return false;
    };

    getItems = () => {
        return {
            items: this.props.items.map(this.itemToTag),
            fullMatch: this.fullMatchInItems()
        };
    };

    _isSelected = (i) => {
        return this.props.selected && (i === this.props.selectedItem || this.props.isSingle);
    };

    getAddBtn = (fullMatch, selected) => {
        if (this.props.hasAddNew && !fullMatch && !this.props.isSingle) {
            return [
                this.props.items.length > 0
                    ?
                    <span key="cat_or"
                          className="cti-category-or">
                        {I18n.t('js.helpers.or')}
                    </span>
                    :
                    null,
                this.props.value.length > 0
                    ?
                    <button key="add_btn"
                            className={classNames('cti-category-add-item', {
                                'cti-selected': selected
                            })}
                            onClick={this._onCreateNew}>
                        {`${this.props.addNewValue} ${this.props.type || this.props.title} "${this.props.value}"`}
                    </button>
                    :
                    this.props.addNewPlaceholder
            ];
        }

        return null;
    };

    render() {
        const {items, fullMatch} = this.getItems();

        const addBtn = this.getAddBtn(
            fullMatch,
            (items.length === 0 || this.props.selectedItem >= items.length) && this.props.selected
        );

        return (
            <div className="cti-category">
                <h5 className="cti-category-title">{this.props.title}</h5>
                <div className="cti-category-tags">
                    {items}
                    {addBtn}
                </div>
            </div>
        );
    }
}
