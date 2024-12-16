import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import CategorizedTagInput from '@js/components/materialize/categorizedTag/categorizedTagInput';

import '@css/components/categorized-tag.scss';


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
        labelClass: PropTypes.string,
        icon: PropTypes.string,
        hasChildTagFocus: PropTypes.bool,
        children: PropTypes.array,
        isSortingCategoriesByAlpha: PropTypes.bool,
        isHorizontal: PropTypes.bool,
        transformInitialTags: PropTypes.func,
        onTabPress: PropTypes.func,
        onChange: PropTypes.func,
        onSubmit: PropTypes.func
    };

    static defaultProps = {
        isSortingCategoriesByAlpha: true,
        isHorizontal: false
    };

    constructor(props) {
        super(props);

        this._categorizedTagInputRef = null;

        if (props.children) {
            let initialTags = props.children;

            if (props.transformInitialTags) {
                initialTags = initialTags.map(props.transformInitialTags).compact();
            }

            this.state.selectedTags = initialTags;
        }
    }

    state = {
        selectedTags: []
    };

    componentDidUpdate(prevProps) {
        if (this.props.children !== prevProps.children) {
            let nextTags = this.props.children;

            if (this.props.transformInitialTags) {
                nextTags = nextTags.map(this.props.transformInitialTags).compact();
            }

            this.setState({
                selectedTags: nextTags
            });
        }

        if (this.props.hasChildTagFocus !== prevProps.hasChildTagFocus) {
            this.focus();
        }
    }

    _handleTabPress = () => {
        if (this.props.onTabPress) {
            this.props.onTabPress();
        }
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

    focus = () => {
        if (this._categorizedTagInputRef) {
            this._categorizedTagInputRef.focus();
        }
    };

    render() {
        const fieldClass = classNames(
            'categorized-tag',
            {
                'input-field': !this.props.isHorizontal,
                'input-horizontal-field': this.props.isHorizontal,
                row: this.props.isHorizontal
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

        const id = this.props.multipleId ? this.props.id + '_' + this.props.multipleId : this.props.id;

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
                    !!this.props.icon &&
                    <span className="material-icons prefix"
                          data-icon={this.props.icon}
                          aria-hidden="true"/>
                }

                <label className={labelClass}>
                    <span className={this.props.labelClass}>
                        {this.props.title}
                    </span>
                </label>

                <div className={sliderClass}>
                    <CategorizedTagInput ref={(categorizedTagInput) => this._categorizedTagInputRef = categorizedTagInput}
                                         categories={this.props.categorizedTags}
                                         isSortingCategoriesByAlpha={this.props.isSortingCategoriesByAlpha}
                                         placeholder={this.props.placeholder}
                                         placeholderWithTags={this.props.placeholderWithTags}
                                         addNewPlaceholder={this.props.addNewPlaceholder}
                                         addNewValue={this.props.addNewText}
                                         transformTag={this._handleTagAdded}
                                         onSubmit={this.props.onSubmit}
                                         onTabPress={this._handleTabPress}
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


