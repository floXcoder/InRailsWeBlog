import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';

import I18n from '@js/modules/translations';
import * as Utils from '@js/modules/utils';

import {
    filterSearch,
} from '@js/actions/searchActions';

import Loader from '@js/components/theme/loader';


class SearchSidebar extends React.Component {
    static propTypes = {
        // from connect
        currentUser: PropTypes.object,
        currentUserTopic: PropTypes.object,
        searchFilters: PropTypes.object,
        articleAvailableFilters: PropTypes.array,
        filterSearch: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    state = {
        activeFilters: {}
    };

    _handleBoolChange = (fieldName, event) => {
        const newFilter = {};
        if (event.target.checked) {
            newFilter[fieldName] = true;
        } else {
            newFilter[fieldName] = undefined;
        }

        this._filterSearch({...this.state.activeFilters, ...newFilter});
    };

    _handleNumberChange = (fieldName, event, value) => {
        const newFilter = {};
        if (Utils.isPresent(value)) {
            newFilter[fieldName] = value;
        } else {
            newFilter[fieldName] = undefined;
        }

        this._filterSearch({...this.state.activeFilters, ...newFilter});
    };

    _formatDateValue = (value) => {
        if (!value) {
            return null;
        }

        const dateValue = new Date(value);

        return dateValue.getDate() + '-' + (dateValue.getMonth() + 1) + '-' + dateValue.getFullYear();
    };

    _filterSearch = (filters) => {
        filters = Utils.compact(filters);

        this.setState({
            activeFilters: filters
        });

        this.props.filterSearch(filters);
    };

    _renderFilterByType = (filter) => {
        if (filter.valueType === 'boolean_type') {
            return (
                <FormControlLabel label={filter.name}
                                  labelPlacement="end"
                                  control={
                                      <Checkbox
                                          checked={this.props.searchFilters[filter.fieldName] || this.state.activeFilters[filter.fieldName] || false}
                                          onChange={this._handleBoolChange.bind(this, filter.fieldName)}/>
                                  }/>
            );
        } else if (filter.valueType === 'number_type') {
            const minRange = Math.min(...Object.keys(filter.aggs));
            const maxRange = Math.max(...Object.keys(filter.aggs));
            const formattedValues = (this.props.searchFilters[filter.fieldName] || this.state.activeFilters[filter.fieldName] || [minRange, maxRange]).map((key) => parseInt(key, 10));

            return (
                <Slider classes={{
                    markLabel: search - sidebar - sliderMark
                }}
                        value={formattedValues}
                        onChangeCommitted={this._handleNumberChange.bind(this, filter.fieldName)}
                        min={minRange}
                        max={maxRange}
                        marks={[{
                            label: minRange,
                            value: minRange
                        }, {
                            label: maxRange,
                            value: maxRange
                        }]}
                        step={1}
                        valueLabelDisplay="auto"
                        aria-labelledby="number-slider"/>
            );
        } else if (filter.valueType === 'date_type') {
            const minRange = Math.min(...Object.keys(filter.aggs));
            const maxRange = Math.max(...Object.keys(filter.aggs));
            const formattedValues = (this.props.searchFilters[filter.fieldName] || this.state.activeFilters[filter.fieldName] || [minRange, maxRange]).map((key) => parseInt(key, 10));
            const dayStep = 3600 * 24 * 1000;

            return (
                <Slider classes={{
                    markLabel: search - sidebar - sliderMark
                }}
                        value={formattedValues}
                        step={dayStep}
                        onChangeCommitted={this._handleNumberChange.bind(this, filter.fieldName)}
                        min={minRange}
                        max={maxRange}
                        marks={[
                            {
                                label: this._formatDateValue(minRange),
                                value: minRange
                            }, {
                                label: this._formatDateValue(maxRange),
                                value: maxRange
                            }
                        ]}
                        valueLabelFormat={this._formatDateValue}
                        getAriaValueText={this._formatDateValue}
                        valueLabelDisplay="off"
                        aria-labelledby="date-slider"/>
            );
        } else if (filter.valueType === 'string_type') {
            return null;
        } else if (filter.valueType === 'text_type') {
            return null;
        } else {
            throw new Error(`Unknown filter type to render: ${filter.valueType}`);
        }
    };

    render() {
        if (this.props.currentUser && !this.props.currentUserTopic) {
            return (
                <div className="search-sidebar-search-sidebar">
                    <div className="center">
                        <Loader size="big"/>
                    </div>
                </div>
            );
        }

        if (!this.props.articleAvailableFilters || this.props.articleAvailableFilters.length === 0) {
            return null;
        }

        return (
            <div className="search-sidebar-search-sidebar">
                <h2 className="search-sidebar-filter-title">
                    {I18n.t('js.search.sidebar.filter')}
                </h2>

                <div>
                    {
                        this.props.articleAvailableFilters.map((filter, i) => (
                            <div key={i}
                                 className="search-sidebar-filter-category">
                                <div className="search-sidebar-filter-category-title">
                                    {filter.name}
                                </div>

                                {this._renderFilterByType(filter)}
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}

export default connect((state) => ({
    currentUser: state.userState.user,
    currentUserTopic: state.topicState.currentTopic,
    searchFilters: state.searchState.searchFilters,
    articleAvailableFilters: state.searchState.articleAvailableFilters
}), {
    filterSearch,
})(SearchSidebar);
