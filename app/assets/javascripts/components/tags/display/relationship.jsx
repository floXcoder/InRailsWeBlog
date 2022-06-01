'use strict';

import List from '@mui/material/List';

import ParentTag from './parent';

function TagRelationshipDisplay(props) {
    return (
        <List dense={true}>
            {
                props.tags.map((tag, i) => (
                    <ParentTag key={i}
                               tag={tag}
                               currentTagSlug={props.currentTagSlug}
                               currentChildTagSlug={props.currentChildTagSlug}
                               isFiltering={props.isFiltering}
                               onTagClick={props.onTagClick}/>
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

TagRelationshipDisplay.defaultProps = {
    isFiltering: false
};

export default TagRelationshipDisplay;
