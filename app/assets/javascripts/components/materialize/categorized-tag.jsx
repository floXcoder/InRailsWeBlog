'use strict';

const {PropTypes} = React;

class Tag extends React.PureComponent {
    static propTypes = {
        input: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        selected: PropTypes.bool,
        isAnimated: PropTypes.bool,
        addable: PropTypes.bool,
        deletable: PropTypes.bool,
        onAdd: PropTypes.func,
        onDelete: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    _tagContent = () => {
        let content = [];
        let startIndex = this.props.text.trim().toLowerCase()
            .indexOf(this.props.input.trim().toLowerCase());
        let endIndex = startIndex + this.props.input.length;

        if (startIndex > 0) {
            content.push(
                <span key={1}
                      className='cti__tag__content--regular'>
                    {this.props.text.substring(0, startIndex)}
                </span>
            );
        }

        content.push(
            <span key={2}
                  className='cti__tag__content--match'>
              {this.props.text.substring(startIndex, endIndex)}
            </span>
        );

        if (endIndex < this.props.text.length) {
            content.push(
                <span key={3}
                      className='cti__tag__content--regular'>
                    {this.props.text.substring(endIndex)}
                </span>
            );
        }

        return content;
    };

    // _onClick = (event) => {
    //     event.preventDefault();
    //     if (this.props.addable) {
    //         this.props.onAdd(event);
    //     }
    // };

    _onDelete = (event) => {
        // Prevents onClick event of the whole tag from being triggered
        event.preventDefault();
        event.stopPropagation();
        this.props.onDelete(event);
    };

    _getDeleteBtn = () => {
        return (
            <span className='cti__tag__delete'
                  onClick={this._onDelete}
                  dangerouslySetInnerHTML={{__html: '&times;'}}/>
        );
    };

    render() {
        let deleteBtn = null;
        if (this.props.deletable) {
            deleteBtn = this._getDeleteBtn();
        }
        let cls = 'cti__tag' + (this.props.selected ? ' cti-selected' : '');
        if (this.props.isAnimated) {
            cls += ' cti__tag__animation'
        }

        return (
            <div className={cls}
                 onClick={this.onClick}>
                <div className='cti__tag__content'>
                    {this._tagContent()}
                </div>
                {deleteBtn}
            </div>
        );
    }
}

class CategorizedInput extends React.Component {
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
                <Tag input=''
                     text={tag.value}
                     selected={false}
                     addable={false}
                     deletable={true}
                     isAnimated={this.props.animateTagValue === tag.value}
                     key={tag.value + '_' + i}
                     onDelete={() => this.props.onTagDeleted(i)}/>
            );
        });
    };

    onBlur = (event) => {
        this.props.closePanel();
        if (typeof this.props.onBlur === 'function') {
            this.props.onBlur(event);
        }
    };

    render() {
        let size = this.props.value.length === 0 ?
            this.props.placeholder.length :
            this.props.value.length;

        let placeholder = this.props.selectedTags.length > 0 && this.props.placeholderWithTags ? this.props.placeholderWithTags : this.props.placeholder;

        return (
            <div className="cti__input"
                 onClick={this.focusInput}>
                {this.getSelectedTags()}
                <input ref={(input) => this._input = input}
                       type="text"
                       id={this.props.id}
                       name={this.props.name}
                       value={this.props.value}
                       size={size + 2}
                       onFocus={this.props.openPanel}
                       onBlur={this.onBlur}
                       onChange={this.props.onValueChange}
                       onKeyDown={this.props.onKeyDown}
                       placeholder={placeholder}
                       aria-label={this.props.placeholder}
                       className='cti__input__input'/>
                {
                    this.props.value.length > 0 &&
                    <div className='cti__input__arrow'/>
                }
            </div>
        );
    }
}

class Category extends React.Component {
    static propTypes = {
        items: PropTypes.array.isRequired,
        category: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]).isRequired,
        title: PropTypes.string.isRequired,
        selected: PropTypes.bool.isRequired,
        selectedItem: PropTypes.number.isRequired,
        input: PropTypes.string.isRequired,
        overhead: PropTypes.number,
        addNew: PropTypes.bool,
        addNewValue: PropTypes.string,
        type: PropTypes.string,
        onAdd: PropTypes.func.isRequired,
        single: PropTypes.bool
    };

    constructor(props) {
        super(props);
    }

    onAdd = (value, isNew) => {
        return () => {
            this.props.onAdd({
                category: this.props.category,
                value: value,
                isNew: isNew
            })
        }
    };

    onCreateNew = (event) => {
        event.preventDefault();
        this.onAdd(this.props.input, true)();
    };

    itemToTag = (value, i) => {
        if (this.props.overhead && i === this.props.overhead) {
            return (
                <div key={value + '_' + i}
                     className='cti__tag__overhead'>
                    {value}
                </div>
            );
        } else {
            return (
                <Tag key={value + '_' + i}
                     selected={this.isSelected(i)}
                     input={this.props.input}
                     text={value}
                     addable={true}
                     deletable={false}
                     onAdd={this.onAdd(value, false)}/>
            );
        }
    };

    fullMatchInItems = () => {
        for (let i = 0, len = this.props.items.length; i < len; i++) {
            if (this.props.items[i] === this.props.input) {
                return true;
            }
        }
        return false;
    };

    getItems = () => {
        return {
            items: this.props.items.map(this.itemToTag),
            fullMatch: this.fullMatchInItems()
        };
    };

    isSelected = (i) => {
        return this.props.selected &&
            (i === this.props.selectedItem || this.props.single);
    };

    getAddBtn = (fullMatch, selected) => {
        if (this.props.addNew && !fullMatch && !this.props.single) {
            return [
                this.props.items.length > 0
                    ?
                    <span key='cat_or'
                          className='cti__category__or'>
                        {I18n.t('js.helpers.or')}
                    </span>
                    :
                    null,
                <button key='add_btn'
                        className={'cti__category__add-item' + (selected ? ' cti-selected' : '')}
                        onClick={this.onCreateNew}>
                    {this.props.addNewValue + ' ' + (this.props.type || this.props.title) + ` "${this.props.input}"`}
                </button>
            ];
        }

        return null;
    };

    render() {
        let {items, fullMatch} = this.getItems();
        let addBtn = this.getAddBtn(
            fullMatch,
            (items.length === 0 || this.props.selectedItem >= items.length) && this.props.selected
        );

        return (
            <div className='cti__category'>
                <h5 className='cti__category__title'>{this.props.title}</h5>
                <div className='cti__category__tags'>
                    {items}
                    {addBtn}
                </div>
            </div>
        );
    }
}

class Panel extends React.Component {
    static propTypes = {
        categories: PropTypes.arrayOf(PropTypes.object).isRequired,
        selection: PropTypes.object.isRequired,
        onAdd: PropTypes.func.isRequired,
        input: PropTypes.string.isRequired,
        addNew: PropTypes.bool,
        addNewValue: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.categories.length === 0) {
            return null;
        }

        return (
            <div className='cti__panel'>
                {
                    this.props.categories.map((category, i) =>
                        <Category key={category.id}
                                  items={category.items}
                                  category={category.id}
                                  title={category.title}
                                  overhead={category.overhead}
                                  selected={this.props.selection.category === i}
                                  selectedItem={this.props.selection.value}
                                  input={this.props.input}
                                  addNew={this.props.addNew}
                                  type={category.type}
                                  onAdd={this.props.onAdd}
                                  single={category.single}
                                  addNewValue={this.props.addNewValue}/>
                    )
                }
            </div>
        );
    }
}

const key = {
    TAB: 9,
    ENTER: 13,
    BACKSPACE: 8,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    COMMA: 188
};

function isCategoryItemValid(i) {
    return typeof i === 'string' && i.trim().length > 0;
}

function isCategoryValid(category) {
    return typeof category === 'object'
        && category.id
        && category.title
        && category.items
        && Array.isArray(category.items)
        && category.items.every(isCategoryItemValid)
        && (category.type || category.single);
}

class CategorizedTagInput extends React.Component {
    static propTypes = {
        categories: PropTypes.arrayOf(PropTypes.object).isRequired,
        id: PropTypes.string,
        name: PropTypes.string,
        addNew: PropTypes.bool,
        transformTag: PropTypes.func,
        value: PropTypes.arrayOf(PropTypes.object),
        onBlur: PropTypes.func,
        onChange: PropTypes.func,
        placeholder: PropTypes.string,
        placeholderWithTags: PropTypes.string,
        addNewValue: PropTypes.string,
        isSortingCategoriesByAlpha: PropTypes.bool,
        minAutocompleteLength: PropTypes.number,
        maxAutocompleteTags: PropTypes.number,
        maxAutocompleteValue: PropTypes.string
    };

    static defaultProps = {
        isSortingCategoriesByAlpha: true,
        addNewValue: 'Add new ',
        minAutocompleteLength: 1,
        maxAutocompleteTags: 4,
        maxAutocompleteValue: '...'
    };

    constructor(props) {
        super(props);
    }

    state = {
        value: '',
        selection: {
            value: 0,
            category: 0
        },
        panelOpened: false,
        selectedTags: this.props.value || [],
        categories: [],
        animateTagValue: null,
        addNew: this.props.addNew === undefined ? true : this.props.addNew
    };

    componentWillMount() {
        if (!this.props.categories.every(isCategoryValid)) {
            throw new Error('invalid categories source provided for react-categorized-tag-input');
        }
    }

    componentWillUnmount() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    filterCategories = (input) => {
        let tagCategories = this.props.categories;

        if (this.props.isSortingCategoriesByAlpha) {
            tagCategories = tagCategories.sort((categoryA, categoryB) => {
                return categoryA.title.localeCompare(categoryB.title);
            })
        }

        let categoriesWithNewTags = tagCategories.map((category) => {
            let newCategory = {
                id: category.id,
                title: category.title,
                type: category.type,
                items: category.items
            };

            this.state.selectedTags.forEach((tag) => {
                if (tag.isNew && tag.category === newCategory.id) {
                    newCategory.items = newCategory.items.concat(tag.value);
                }
            });

            return newCategory;
        });

        let categories = categoriesWithNewTags.map((category) => {
            category = Object.assign({}, category, {
                items: category.items.filter(this.filterItems(input, this.props.minAutocompleteLength))
            });

            if (category.items.length > this.props.maxAutocompleteTags) {
                category.items.length = this.props.maxAutocompleteTags;
                category.items.push(this.props.maxAutocompleteValue);
                category.overhead = this.props.maxAutocompleteTags;
            }

            return (category.items.length === 0 && (!this.state.addNew || category.single)) ? null : category;
        }).filter(c => c !== null);

        let selection = this.state.selection;
        if (this.state.selection.category >= categories.length) {
            selection = {
                category: 0,
                value: 0
            };
        } else {
            if (selection.value >= categories[selection.category].items.length) {
                selection.value = 0;
            }
        }

        this.setState({
            categories: categories,
            selection: selection
        });
    };

    filterItems = (input, minAutocompleteLength) => {
        return function (i) {
            // if (input.length === 1) {
            //     return i.toLowerCase().trim() === input;
            // }
            if (input.length < minAutocompleteLength) {
                return false;
            }

            return i.toLowerCase().indexOf(input.trim().toLowerCase()) >= 0;
        };
    };

    openPanel = () => {
        this.setState({panelOpened: true});
    };

    closePanel = () => {
        // Prevent the panel from hiding before the click action takes place
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
            this.timeout = undefined;
            this.setState({panelOpened: false});
        }, 150);
    };

    onValueChange = (e) => {
        let value = e.target.value;
        this.setState({value, panelOpened: value.trim().length > 0 || !isNaN(Number(value.trim()))});
        this.filterCategories(value);
    };

    onTagDeleted = (i) => {
        let newTags = this.state.selectedTags.slice(0, i)
            .concat(this.state.selectedTags.slice(i + 1));
        this.setState({
            selectedTags: newTags
        });

        if (typeof this.props.onChange === 'function') {
            this.props.onChange(newTags);
        }
    };

    onAdd = (newTag) => {
        let {category, value, isNew} = newTag;

        if (typeof this.props.transformTag === 'function') {
            value = this.props.transformTag(category, value);
        }

        let tagValuePresent = null;
        this.state.selectedTags.forEach((tag) => {
            let regex = new RegExp('^' + tag.value + '[s|x]?$', 'i');
            if (tag.category.toLowerCase() === category.toLowerCase() && regex.test(value)) {
                tagValuePresent = tag.value;
            }
        });

        if (tagValuePresent) {
            this.setState({
                value: '',
                animateTagValue: tagValuePresent,
                panelOpened: true
            });
        } else {
            let newTags = this.state.selectedTags.concat([{
                category: category,
                value: value,
                isNew: isNew
            }]);

            this.setState({
                selectedTags: newTags,
                value: '',
                panelOpened: true
            });

            this._input.focusInput();
            if (typeof this.props.onChange === 'function') {
                this.props.onChange(newTags);
            }
        }
    };

    addSelectedTag = () => {
        if (!(this.state.panelOpened && this.state.value.length > 0)) {
            return;
        }

        let category = this.state.categories[this.state.selection.category];
        if (category) {
            let value = category.items[this.state.selection.value];

            this.onAdd({
                category: category.id,
                value: value || this.state.value,
                isNew: !value
            });
        }
    };

    handleBackspace = (e) => {
        if (this.state.value.trim().length === 0) {
            e.preventDefault();
            this.onTagDeleted(this.state.selectedTags.length - 1);
        }
    };

    handleArrowLeft = () => {
        let result = this.state.selection.value - 1;
        this.setState({
            selection: {
                category: this.state.selection.category,
                value: result >= 0 ? result : 0
            }
        });
    };

    handleArrowUp = () => {
        let result = this.state.selection.category - 1;
        this.setState({
            selection: {
                category: result >= 0 ? result : 0,
                value: 0
            }
        });
    };

    handleArrowRight = () => {
        let result = this.state.selection.value + 1;
        let cat = this.state.categories[this.state.selection.category];
        this.setState({
            selection: {
                category: this.state.selection.category,
                value: result <= cat.items.length ? result : cat.items.length
            }
        });
    };

    handleArrowDown = () => {
        let result = this.state.selection.category + 1;
        let cats = this.state.categories;
        this.setState({
            selection: {
                category: result < cats.length ? result : cats.length - 1,
                value: 0
            }
        });
    };

    onKeyDown = (e) => {
        switch (e.keyCode) {
            case key.TAB:
            case key.ENTER:
            case key.COMMA:
                e.preventDefault();
                this.addSelectedTag();
                break;
            case key.BACKSPACE:
                this.handleBackspace(e);
                break;
            case key.LEFT:
                this.handleArrowLeft();
                break;
            case key.UP:
                this.handleArrowUp();
                break;
            case key.RIGHT:
                this.handleArrowRight();
                break;
            case key.DOWN:
                this.handleArrowDown();
                break;
        }
    };

    value = () => {
        return this.state.selectedTags;
    };

    render() {
        return (
            <div className='cti__root'>
                <CategorizedInput ref={(input) => this._input = input}
                                  id={this.props.id}
                                  name={this.props.name}
                                  openPanel={this.openPanel}
                                  closePanel={this.closePanel}
                                  onValueChange={this.onValueChange}
                                  onTagDeleted={this.onTagDeleted}
                                  onKeyDown={this.onKeyDown}
                                  placeholder={this.props.placeholder}
                                  placeholderWithTags={this.props.placeholderWithTags}
                                  animateTagValue={this.state.animateTagValue}
                                  value={this.state.value}
                                  selectedTags={this.state.selectedTags}
                                  onBlur={this.props.onBlur}/>
                {
                    this.state.panelOpened && this.state.value.length > 0
                        ?
                        <Panel categories={this.state.categories}
                               selection={this.state.selection}
                               onAdd={this.onAdd}
                               input={this.state.value}
                               addNew={this.props.addNew === undefined ? true : this.props.addNew}
                               addNewValue={this.props.addNewValue}/>
                        :
                        ''
                }
            </div>
        );
    }
}

export default class CategorizedTag extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        categorizedTags: PropTypes.array.isRequired,
        placeholder: PropTypes.string.isRequired,
        placeholderWithTags: PropTypes.string,
        name: PropTypes.string,
        multipleId: PropTypes.number,
        icon: PropTypes.string,
        children: PropTypes.array,
        isSortingCategoriesByAlpha: PropTypes.bool,
        isHorizontal: PropTypes.bool,
        transformInitialTags: PropTypes.func,
        onTagChange: PropTypes.func
    };

    static defaultProps = {
        name: null,
        multipleId: null,
        icon: null,
        children: null,
        isSortingCategoriesByAlpha: true,
        isHorizontal: false,
        transformInitialTags: null,
        onTagChange: null
    };

    state = {
        selectedTags: []
    };

    componentWillMount() {
        if (this.props.children) {
            let initialTags = this.props.children;
            if (this.props.transformInitialTags) {
                initialTags = initialTags.map((tag) => this.props.transformInitialTags(tag));
            }

            this.setState({
                selectedTags: initialTags
            });
        }
    }

    _handleTagAdded = (categoryId, tagName) => {
        this.setState({
            selectedTags: this.state.selectedTags.concat([{
                category: categoryId,
                value: tagName.capitalize()
            }])
        });

        return tagName.capitalize();
    };

    _handleTagChanged = (tags) => {
        this.setState({
            selectedTags: tags
        });

        if (this.props.onTagChange) {
            this.props.onTagChange(tags);
        }
    };

    render() {
        const fieldClass = classNames(
            'categorized-tag',
            {
                'input-field': !this.props.isHorizontal,
                'input-horizontal-field': this.props.isHorizontal,
                'row': this.props.isHorizontal
            }
        );

        const labelClass = classNames(
            {
                'col m4': this.props.isHorizontal
            }
        );

        const sliderClass = classNames(
            'categorized-tag-input',
            {
                'col m8': this.props.isHorizontal
            }
        );

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
            <div className={fieldClass}>
                {
                    this.props.icon &&
                    <i className="material-icons prefix">{this.props.icon}</i>
                }

                <label className={labelClass}>
                    {this.props.title}
                </label>

                <div className={sliderClass}>
                    <CategorizedTagInput categories={this.props.categorizedTags}
                                         isSortingCategoriesByAlpha={this.props.isSortingCategoriesByAlpha}
                                         placeholder={this.props.placeholder}
                                         placeholderWithTags={this.props.placeholderWithTags}
                                         addNew={true}
                                         addNewValue={I18n.t('js.categorized_tag.add_new')}
                                         transformTag={this._handleTagAdded}
                                         onChange={this._handleTagChanged}
                                         value={this.state.selectedTags}/>

                    {
                        this.state.selectedTags.map((selectedTag, i) =>
                            <input key={i}
                                   id={id + '_' + i}
                                   name={name + '[]'}
                                   value={`${selectedTag.category},${selectedTag.value}`}
                                   type="hidden"/>
                        )
                    }
                </div>
            </div>
        );
    }
}


