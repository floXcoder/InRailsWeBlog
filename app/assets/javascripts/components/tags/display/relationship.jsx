'use strict';

import ParentTag from './parent';

const TagRelationshipDisplay = ({tags, isFiltering}) => (
    <div>
        {
            tags.map((tag, i) => (
                <ParentTag key={i}
                           tag={tag}
                           isFiltering={isFiltering}/>
            ))
        }
    </div>
);

TagRelationshipDisplay.propTypes = {
    tags: PropTypes.array.isRequired,
    isFiltering: PropTypes.bool
};

TagRelationshipDisplay.defaultProps = {
    isFiltering: false
};

export default TagRelationshipDisplay;
