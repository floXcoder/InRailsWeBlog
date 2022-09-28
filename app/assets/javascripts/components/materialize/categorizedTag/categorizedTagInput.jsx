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
        onTabPress: PropTypes.func,
        onBlur: PropTypes.func,
        onChange: PropTypes.func,
        onSubmit: PropTypes.func,
        placeholder: PropTypes.string,
        placeholderWithTags: PropTypes.string,
        addNewPlaceholder: PropTypes.string,
        addNewValue: PropTypes.string,
        isSortingCategoriesByAlpha: PropTypes.bool,
        minAutocompleteLength: PropTypes.number,
        maxAutocompleteTags: PropTypes.number,
        maxAutocompleteValue: PropTypes.string
    };

    static defaultProps = {
        hasAddNew: true,
        isSortingCategoriesByAlpha: true,
        addNewPlaceholder: 'Enter label name',
        addNewValue: 'Add new ',
        minAutocompleteLength: 1,
        maxAutocompleteTags: 4,
        maxAutocompleteValue: '...'
    };

    constructor(props) {
        super(props);

        if (!props.categories.every(isCategoryValid)) {
            throw new Error('invalid categories source provided for react-categorized-tag-input');
        }
    }

    state = {
        value: '',
        selection: {
            item: 0,
            category: 0
        },
        isPanelOpen: false,
        selectedTags: this.props.value || [],
        categories: this.props.categories,
        animateTagValue: undefined
    };

    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value) {
            this.setState({
                selectedTags: this.props.value || []
            });
        }

        if (this.props.categories !== prevProps.categories) {
            this.setState({
                categories: this.props.categories || []
            });
        }
    }

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
                .slice();
        }

        const categoriesWithNewTags = tagCategories.map((category) => {
            const newCategory = {
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

        const categories = categoriesWithNewTags.map((category) => {
            category = {
                ...category,
                items: category.items.filter(this.filterItems(value, this.props.minAutocompleteLength))
            };

            if (category.items.length > this.props.maxAutocompleteTags) {
                category.items.length = this.props.maxAutocompleteTags;
                category.items.push(this.props.maxAutocompleteValue);
                category.overhead = this.props.maxAutocompleteTags;
            }

            return (category.items.length === 0 && (!this.props.hasAddNew || category.isSingle)) ? null : category;
        })
            .filter((c) => c !== null);

        let selection = this.state.selection;
        if (this.state.selection.category >= categories.length) {
            selection = {
                category: 0,
                item: 0
            };
        } else if (selection.item >= categories[selection.category].items.length) {
            selection.item = 0;
        }

        this.setState({
            categories: categories,
            selection: selection
        });
    };

    filterItems = (value, minAutocompleteLength) => {
        return function (item) {
            // if (value.length === 1) {
            //     return item.toLowerCase().trim() === value;
            // }

            if (value.length < minAutocompleteLength) {
                return false;
            }

            return item.toLowerCase()
                .indexOf(value.trim()
                    .toLowerCase()) >= 0;
        };
    };

    openPanel = () => {
        this.setState({
            isPanelOpen: true
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
                isPanelOpen: false
            });
        }, 150);
    };

    onValueChange = (event) => {
        const value = event.target.value;

        this.setState({
            value,
            isPanelOpen: value.trim().length > 0 || !Number.isNaN(Number(value.trim()))
        });

        this.filterCategories(value);
    };

    onTagDeleted = (i) => {
        const newTags = this.state.selectedTags.slice(0, i)
            .concat(this.state.selectedTags.slice(i + 1));

        this.setState({
            selectedTags: newTags
        });

        if (this.props.onChange) {
            this.props.onChange(newTags);
        }
    };

    onAdd = (newTag) => {
        let {
            category,
            value,
            isNew
        } = newTag;

        if (this.props.transformTag) {
            value = this.props.transformTag(category, value);
        }

        let tagValuePresent = null;
        this.state.selectedTags.forEach((tag) => {
            const regex = new RegExp('^' + tag.value + '[s|x]?$', 'i');
            if (tag.category.toLowerCase() === category.toLowerCase() && regex.test(value)) {
                tagValuePresent = tag.value;
            }
        });

        if (tagValuePresent) {
            this.setState({
                value: '',
                animateTagValue: tagValuePresent,
                isPanelOpen: true
            });
        } else {
            const newTags = this.state.selectedTags.concat([{
                category: category,
                value: value,
                isNew: isNew
            }]);

            this.setState({
                selectedTags: newTags,
                value: '',
                isPanelOpen: true
            });

            this._input.focusInput();
            if (this.props.onChange) {
                this.props.onChange(newTags);
            }
        }
    };

    addSelectedTag = () => {
        if (!(this.state.isPanelOpen && this.state.value.length > 0)) {
            return;
        }

        const category = this.state.categories[this.state.selection.category];
        if (category) {
            const title = category.items[this.state.selection.item];

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
        const result = this.state.selection.item - 1;
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
                event.preventDefault();
                if (this.props.onTabPress) {
                    this.props.onTabPress();
                } else {
                    this.addSelectedTag();
                }
                break;
            case key.ENTER:
                event.preventDefault();
                if (event.ctrlKey && this.props.onSubmit) {
                    this.props.onSubmit();
                } else {
                    this.addSelectedTag();
                }
                break;
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

    focus = () => {
        this._input.focusInput();
    };

    value = () => {
        return this.state.selectedTags;
    };

    render() {
        return (
            <div className="cti-root">
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
                    this.state.isPanelOpen &&
                    <Panel categories={this.state.categories}
                           selection={this.state.selection}
                           onAdd={this.onAdd}
                           value={this.state.value}
                           hasAddNew={this.props.hasAddNew}
                           addNewPlaceholder={this.props.addNewPlaceholder}
                           addNewValue={this.props.addNewValue}/>
                }
            </div>
        );
    }
}
