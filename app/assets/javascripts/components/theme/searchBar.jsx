'use strict';

import TextField from '@material-ui/core/TextField';

const SearchBar = ({classes, label, children, onSearchInput}) => (
    <form className="tag-search"
          noValidate={true}
          onSubmit={_handleSubmit}>
        <TextField id="filter-text-input"
                   classes={{
                       root: classes
                   }}
                   label={label}
                   margin="normal"
                   variant="standard"
                   onChange={_handleSearchChange.bind(null, onSearchInput)}/>
    </form>
);

const _handleSearchChange = (onSearchInput, event) => {
    onSearchInput(event.target.value);
};

const _handleSubmit = () => {
    return false;
};

SearchBar.propTypes = {
    label: PropTypes.string.isRequired,
    onSearchInput: PropTypes.func.isRequired,
    classes: PropTypes.string,
    children: PropTypes.string
};

export default SearchBar;
