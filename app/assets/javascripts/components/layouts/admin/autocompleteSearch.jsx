import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';

import SearchIcon from '@mui/icons-material/Search';
import HelpIcon from '@mui/icons-material/Help';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ClassIcon from '@mui/icons-material/Class';
import LabelIcon from '@mui/icons-material/Label';
import AssignmentIcon from '@mui/icons-material/Assignment';

import I18n from '@js/modules/translations';

import {
    fetchMetaSearch
} from '@js/actions/admin';

import {
    getMetaResults
} from '@js/selectors/adminSelectors';

import {
    metaSearchLimit
} from '@js/components/modules/constants';

import Autocomplete from '@js/components/theme/autocomplete';

import HelpDialog from '@js/components/layouts/admin/helpDialog';


class AutocompleteSearch extends React.Component {
    static propTypes = {
        // from connect
        metaResults: PropTypes.array,
        fetchMetaSearch: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    state = {
        isHelpOpen: false,
        query: (new URL(window.location)).searchParams.get('query') || ''
    };

    _handleAutocompleteChange = (selection) => {
        window.open(selection.link, '_blank');

        this.setState({
            query: selection.value
        });
    };

    _fetchAutocomplete = (value) => {
        this.props.fetchMetaSearch(value, {limit: metaSearchLimit});
    };

    _handleHelpClick = (event) => {
        event.preventDefault();

        this.setState({isHelpOpen: true});
    };

    _handleHelpClose = () => {
        this.setState({isHelpOpen: false});
    };

    _renderSuggestion = (suggestion) => {
        return (
            <>
                {
                    suggestion.model === 'user' &&
                    <ListItemIcon>
                        <AccountBoxIcon fontSize="small"/>
                    </ListItemIcon>
                }
                {
                    suggestion.model === 'topic' &&
                    <ListItemIcon>
                        <ClassIcon fontSize="small"/>
                    </ListItemIcon>
                }
                {
                    suggestion.model === 'tag' &&
                    <ListItemIcon>
                        <LabelIcon fontSize="small"/>
                    </ListItemIcon>
                }
                {
                    suggestion.model === 'article' &&
                    <ListItemIcon>
                        <AssignmentIcon fontSize="small"/>
                    </ListItemIcon>
                }

                <Typography variant="inherit"
                            noWrap={true}>
                    {suggestion.value}
                </Typography>
            </>
        );
    };

    render() {
        return (
            <>
                <div className="search-admin">
                    <div className="search-icon">
                        <SearchIcon/>
                    </div>

                    <Autocomplete suggestions={this.props.metaResults.map((element) => ({
                        key: `${element.model}-${element.id}`,
                        value: element.value,
                        link: element.link,
                        model: element.model
                    }))}
                                  placeholder={I18n.t('js.admin.search.placeholder')}
                                  name="query"
                                  inputVariant="standard"
                                  inputMargin="none"
                                  classes={{
                                      root: 'input-root',
                                      input: 'input-input'
                                  }}
                                  isAsync={true}
                                  fullWidth={true}
                                  hasFilterValues={true}
                                  disableUnderline={true}
                                  fetchAsyncValues={this._fetchAutocomplete}
                                  currentSuggestion={this.state.query}
                                  renderSuggestion={this._renderSuggestion}
                                  onChange={this._handleAutocompleteChange}/>

                    <a className="help-icon"
                       href="#"
                       onClick={this._handleHelpClick}>
                        <HelpIcon/>
                    </a>
                </div>

                <HelpDialog isOpen={this.state.isHelpOpen}
                            onHelpClose={this._handleHelpClose}/>
            </>
        );
    }
}

export default connect((state) => ({
    metaResults: getMetaResults(state)
}), {
    fetchMetaSearch
})(AutocompleteSearch)