'use strict';

import Input from '../materialize/input';

const SearchBar = ({label, children, onUserInput}) => (
    <form className="tag-search"
          onSubmit={SearchBar._handleSubmit}>
        <Input id="filter-text-input"
               title={label}
               onChange={(event) => SearchBar._handleSearchChange(onUserInput, event)}/>
    </form>
);

SearchBar._handleSearchChange = (onUserInput, event) => {
    onUserInput(event.target.value);
};

SearchBar._handleSubmit = () => {
    return false;
};

SearchBar.propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.string,
    onUserInput: PropTypes.func
};

SearchBar.defaultProps = {
    children: null,
    onUserInput: null
};

export default SearchBar;
