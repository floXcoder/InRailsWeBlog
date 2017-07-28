'use strict';

const SearchBar = ({label, children, onSearchInput}) => (
    <form className="tag-search"
          onSubmit={_handleSubmit}>
        <input id="search"
               type="text"
               name="search"
               placeholder="Tag name ?"
               onChange={onSearchInput}/>

        <input id="search_submit"
               type="submit"
               value="Rechercher"/>
    </form>
);

const _handleSubmit = () => {
    return false;
};

SearchBar.propTypes = {
    label: React.PropTypes.string.isRequired,
    children: React.PropTypes.string,
    onSearchInput: React.PropTypes.func
};

SearchBar.defaultProps = {
    children: null,
    onSearchInput: null
};

export default SearchBar;
