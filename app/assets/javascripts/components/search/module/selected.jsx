'use strict';

import Chip from '@material-ui/core/Chip';

function SearchSelectedModule(props) {
    return (
        <div className="search-category">
            <div className="tag-selected-list">
                {
                    props.selectedTags.map((tag) => (
                        <Chip key={tag.id}
                              label={tag.name}
                              color="primary"
                              variant="outlined"
                              onClick={props.onTagClick.bind(null, tag)}/>
                    ))
                }
            </div>
        </div>
    );
}

SearchSelectedModule.propTypes = {
    selectedTags: PropTypes.array.isRequired,
    onTagClick: PropTypes.func.isRequired
};

export default  SearchSelectedModule;
