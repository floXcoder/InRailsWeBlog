'use strict';

import Input from '../materialize/input';

const SearchBar = ({label, children, onSearchInput}) => (
    <form className="tag-search"
          onSubmit={_handleSubmit}>
        <Input id="filter-text-input"
               title={label}
               onChange={_handleSearchChange.bind(null, onSearchInput)}/>
    </form>
);

const _handleSearchChange = (onSearchInput, value) => {
    onSearchInput(value);
};

const _handleSubmit = () => {
    return false;
};

SearchBar.propTypes = {
    label: PropTypes.string.isRequired,
    onSearchInput: PropTypes.func.isRequired,
    children: PropTypes.string
};

export default SearchBar;
