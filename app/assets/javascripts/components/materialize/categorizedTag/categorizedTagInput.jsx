'use strict';

import CategorizedInput from './categorizedInput';
import Panel from './panel';

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
        && (category.type || category.isSingle);
}

export default class CategorizedTagInput extends React.Component {
    static propTypes = {
        categories: PropTypes.arrayOf(PropTypes.object).isRequired,
        id: PropTypes.string,
        name: PropTypes.string,
        hasAddNew: PropTypes.bool,
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
        hasAddNew: true,
        isSortingCategoriesByAlpha: true,
        addNewValue: 'Add new ',
        minAutocompleteLength: 1,
        maxAutocompleteTags: 4,
        maxAutocompleteValue: '...'
    };

    constructor(props) {
        super(props);

        if (!this.props.categories.every(isCategoryValid)) {
            throw new Error('invalid categories source provided for react-categorized-tag-input');
        }
    }

    state = {
        value: '',
        selection: {
            item: 0,
            category: 0
        },
        isPanelOpened: false,
        selectedTags: this.props.value || [],
        categories: this.props.categories,
        animateTagValue: undefined
    };

    componentWillUnmount() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    filterCategories = (value) => {
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
                items: category.items.filter(this.filterItems(value, this.props.minAutocompleteLength))
            });

            if (category.items.length > this.props.maxAutocompleteTags) {
                category.items.length = this.props.maxAutocompleteTags;
                category.items.push(this.props.maxAutocompleteValue);
                category.overhead = this.props.maxAutocompleteTags;
            }

            return (category.items.length === 0 && (!this.props.hasAddNew || category.isSingle)) ? null : category;
        }).filter(c => c !== null);

        let selection = this.state.selection;
        if (this.state.selection.category >= categories.length) {
            selection = {
                category: 0,
                item: 0
            };
        } else {
            if (selection.item >= categories[selection.category].items.length) {
                selection.item = 0;
            }
        }

        this.setState({
            categories: categories,
            selection: selection
        });
    };

    filterItems = (value, minAutocompleteLength) => {
        return function (i) {
            // if (value.length === 1) {
            //     return i.toLowerCase().trim() === value;
            // }

            if (value.length < minAutocompleteLength) {
                return false;
            }

            return i.toLowerCase().indexOf(value.trim().toLowerCase()) >= 0;
        };
    };

    openPanel = () => {
        this.setState({
            isPanelOpened: true
        });
    };

    closePanel = () => {
        // Prevent the panel from hiding before the click action takes place
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
            this.timeout = undefined;
            this.setState({
                isPanelOpened: false
            });
        }, 150);
    };

    onValueChange = (e) => {
        const value = e.target.value;

        this.setState({
            value,
            isPanelOpened: value.trim().length > 0 || !isNaN(Number(value.trim()))
        });

        this.filterCategories(value);
    };

    onTagDeleted = (i) => {
        let newTags = this.state.selectedTags.slice(0, i).concat(this.state.selectedTags.slice(i + 1));

        this.setState({
            selectedTags: newTags
        });

        if (this.props.onChange) {
            this.props.onChange(newTags);
        }
    };

    onAdd = (newTag) => {
        let {category, value, isNew} = newTag;

        if (this.props.transformTag) {
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
                isPanelOpened: true
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
                isPanelOpened: true
            });

            this._input.focusInput();
            if (this.props.onChange) {
                this.props.onChange(newTags);
            }
        }
    };

    addSelectedTag = () => {
        if (!(this.state.isPanelOpened && this.state.value.length > 0)) {
            return;
        }

        let category = this.state.categories[this.state.selection.category];
        if (category) {
            let title = category.items[this.state.selection.item];

            this.onAdd({
                category: category.id,
                value: title || this.state.value,
                isNew: !title
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
        let result = this.state.selection.item - 1;
        this.setState({
            selection: {
                category: this.state.selection.category,
                item: result >= 0 ? result : 0
            }
        });
    };

    handleArrowRight = () => {
        const result = this.state.selection.item + 1;
        const categories = this.state.categories[this.state.selection.category];

        this.setState({
            selection: {
                category: this.state.selection.category,
                item: result <= categories.items.length ? result : categories.items.length
            }
        });
    };

    handleArrowUp = () => {
        const result = this.state.selection.category - 1;

        this.setState({
            selection: {
                category: result >= 0 ? result : 0,
                item: 0
            }
        });
    };

    handleArrowDown = () => {
        const result = this.state.selection.category + 1;
        const categories = this.state.categories;

        this.setState({
            selection: {
                category: result < categories.length ? result : categories.length - 1,
                item: 0
            }
        });
    };

    onKeyDown = (event) => {
        switch (event.keyCode) {
            case key.TAB:
            case key.ENTER:
            case key.COMMA:
                event.preventDefault();
                this.addSelectedTag();
                break;
            case key.BACKSPACE:
                this.handleBackspace(event);
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
            <div className="cti__root">
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
                    (this.state.isPanelOpened && this.state.value.length > 0) &&
                    <Panel categories={this.state.categories}
                           selection={this.state.selection}
                           onAdd={this.onAdd}
                           value={this.state.value}
                           hasAddNew={this.props.hasAddNew}
                           addNewValue={this.props.addNewValue}/>
                }
            </div>
        );
    }
}
