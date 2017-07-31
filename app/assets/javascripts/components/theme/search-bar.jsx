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
    label: PropTypes.string.isRequired,
    children: PropTypes.string,
    onSearchInput: PropTypes.func
};

SearchBar.defaultProps = {
    children: null,
    onSearchInput: null
};

export default SearchBar;
