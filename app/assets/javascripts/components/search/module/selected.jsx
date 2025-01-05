import PropTypes from 'prop-types';

import Chip from '@mui/material/Chip';


const SearchSelectedModule = function ({
                                           selectedTags,
                                           onTagClick
                                       }) {
    return (
        <div className="search-category">
            <div className="tag-selected-list">
                {
                    selectedTags.map((tag) => (
                        <Chip key={tag.id}
                              label={tag.name}
                              color="primary"
                              variant="outlined"
                              onClick={onTagClick.bind(null, tag)}/>
                    ))
                }
            </div>
        </div>
    );
};

SearchSelectedModule.propTypes = {
    selectedTags: PropTypes.array.isRequired,
    onTagClick: PropTypes.func.isRequired
};

export default SearchSelectedModule;
