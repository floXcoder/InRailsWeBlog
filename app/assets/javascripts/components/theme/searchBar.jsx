'use strict';

import TextField from '@mui/material/TextField';

const _handleSearchChange = (onSearchInput, event) => {
    onSearchInput(event.target.value);
};

const _handleSubmit = () => {
    return false;
};

function SearchBar({
                       classes,
                       label,
                       onSearchInput
                   }) {
    return (
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
}

SearchBar.propTypes = {
    label: PropTypes.string.isRequired,
    onSearchInput: PropTypes.func.isRequired,
    classes: PropTypes.string
};

export default SearchBar;
