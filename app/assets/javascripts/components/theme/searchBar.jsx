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
    classes: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onSearchInput: PropTypes.func.isRequired,
    children: PropTypes.string
};

export default React.memo(SearchBar);
