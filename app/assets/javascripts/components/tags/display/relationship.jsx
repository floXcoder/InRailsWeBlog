import PropTypes from 'prop-types';

import List from '@mui/material/List';

import ParentTag from '@js/components/tags/display/parent';

function TagRelationshipDisplay({
                                    tags,
                                    onTagClick,
                                    currentTagSlug,
                                    currentChildTagSlug,
                                    isFiltering = false
                                }) {
    return (
        <List dense={true}>
            {
                tags.map((tag, i) => (
                    <ParentTag key={i}
                               tag={tag}
                               currentTagSlug={currentTagSlug}
                               currentChildTagSlug={currentChildTagSlug}
                               isFiltering={isFiltering}
                               onTagClick={onTagClick}/>
                ))
            }
        </List>
    );
}

TagRelationshipDisplay.propTypes = {
    tags: PropTypes.array.isRequired,
    onTagClick: PropTypes.func.isRequired,
    currentTagSlug: PropTypes.string,
    currentChildTagSlug: PropTypes.string,
    isFiltering: PropTypes.bool
};

export default TagRelationshipDisplay;
