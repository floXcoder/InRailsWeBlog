'use strict';

const Input = require('../materialize/input');

let SearchBar = ({label, children, onUserInput}) => (
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
    label: React.PropTypes.string.isRequired,
    children: React.PropTypes.string,
    onUserInput: React.PropTypes.func
};

SearchBar.defaultProps = {
    children: null,
    onUserInput: null
};

module.exports = SearchBar;
