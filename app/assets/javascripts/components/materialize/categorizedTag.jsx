'use strict';

import CategorizedTagInput from './categorizedTag/categorizedTagInput';

export default class CategorizedTag extends React.Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        categorizedTags: PropTypes.array.isRequired,
        placeholder: PropTypes.string.isRequired,
        addNewPlaceholder: PropTypes.string.isRequired,
        addNewText: PropTypes.string.isRequired,
        placeholderWithTags: PropTypes.string,
        name: PropTypes.string,
        multipleId: PropTypes.number,
        icon: PropTypes.string,
        children: PropTypes.array,
        isSortingCategoriesByAlpha: PropTypes.bool,
        isHorizontal: PropTypes.bool,
        transformInitialTags: PropTypes.func,
        onChange: PropTypes.func
    };

    static defaultProps = {
        isSortingCategoriesByAlpha: true,
        isHorizontal: false
    };

    constructor(props) {
        super(props);

        if (props.children) {
            let initialTags = props.children;

            if (props.transformInitialTags) {
                initialTags = initialTags.map((tag) => props.transformInitialTags(tag));
            }

            this.state.selectedTags = initialTags;
        }
    }

    state = {
        selectedTags: []
    };

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

        if (this.props.onChange) {
            this.props.onChange(tags);
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
                    <span className="material-icons prefix"
                          data-icon={this.props.icon}
                          aria-hidden="true"/>
                }

                <label className={labelClass}>
                    {this.props.title}
                </label>

                <div className={sliderClass}>
                    <CategorizedTagInput categories={this.props.categorizedTags}
                                         isSortingCategoriesByAlpha={this.props.isSortingCategoriesByAlpha}
                                         placeholder={this.props.placeholder}
                                         placeholderWithTags={this.props.placeholderWithTags}
                                         addNewPlaceholder={this.props.addNewPlaceholder}
                                         addNewValue={this.props.addNewText}
                                         transformTag={this._handleTagAdded}
                                         onChange={this._handleTagChanged}
                                         value={this.state.selectedTags}/>

                    {
                        this.state.selectedTags.map((selectedTag, i) => (
                            <input key={i}
                                   id={`${id}_${i}`}
                                   name={`${name}[]`}
                                   value={`${selectedTag.category},${selectedTag.value}`}
                                   type="hidden"/>
                        ))
                    }
                </div>
            </div>
        );
    }
}


