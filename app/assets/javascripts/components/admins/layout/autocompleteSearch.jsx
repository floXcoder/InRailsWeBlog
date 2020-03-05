'use strict';

import {
    withStyles
} from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';

import SearchIcon from '@material-ui/icons/Search';
import HelpIcon from '@material-ui/icons/Help';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ClassIcon from '@material-ui/icons/Class';
import LabelIcon from '@material-ui/icons/Label';
import AssignmentIcon from '@material-ui/icons/Assignment';

import {
    fetchMetaSearch
} from '../../../actions/admin';

import {
    getMetaResults
} from '../../../selectors/adminSelectors';

import {
    metaSearchLimit
} from '../../modules/constants';

import Autocomplete from '../../../components/theme/autocomplete';

import HelpDialog from './helpDialog';

import styles from '../../../../jss/admin/layout';

export default @connect((state) => ({
    metaResults: getMetaResults(state)
}), {
    fetchMetaSearch
})
@withStyles(styles)
class AutocompleteSearch extends React.Component {
    static propTypes = {
        // from connect
        metaResults: PropTypes.array,
        fetchMetaSearch: PropTypes.func,
        // from styles
        classes: PropTypes.object
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
                <ListItemIcon>
                    {
                        suggestion.model === 'user' &&
                        <AccountBoxIcon fontSize="small"/>
                    }
                    {
                        suggestion.model === 'topic' &&
                        <ClassIcon fontSize="small"/>
                    }
                    {
                        suggestion.model === 'tag' &&
                        <LabelIcon fontSize="small"/>
                    }
                    {
                        suggestion.model === 'article' &&
                        <AssignmentIcon fontSize="small"/>
                    }
                </ListItemIcon>

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
                <div className={this.props.classes.search}>
                    <div className={this.props.classes.searchIcon}>
                        <SearchIcon/>
                    </div>

                    <Autocomplete suggestions={this.props.metaResults.map((product) => ({
                        key: `${product.model}-${product.id}`,
                        value: product.value,
                        link: product.link,
                        model: product.model
                    }))}
                                  placeholder={I18n.t('js.admin.search.placeholder')}
                                  name="query"
                                  inputVariant="standard"
                                  inputMargin="none"
                                  classes={{
                                      root: this.props.classes.inputRoot,
                                      input: this.props.classes.inputInput
                                  }}
                                  isAsync={true}
                                  fullWidth={true}
                                  filterValues={true}
                                  disableUnderline={true}
                                  fetchAsyncValues={this._fetchAutocomplete}
                                  currentSuggestion={this.state.query}
                                  renderSuggestion={this._renderSuggestion}
                                  onChange={this._handleAutocompleteChange}/>

                    <a className={this.props.classes.helpIcon}
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
