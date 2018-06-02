'use strict';

import {
    Link
} from 'react-router-dom';

const ChildTag = ({tag, parentTagSlug, isExpanded, currentTagSlugs, onTagClick}) => (
    <Link className={classNames('tag-child tag-child-name', {
        'tag-child-display': isExpanded,
        'tag-selected': currentTagSlugs.includes(tag.slug)
    })}
          to={`/tagged/${parentTagSlug}/${tag.slug}`}
          onClick={onTagClick}>
        {tag.name}
    </Link>
);

ChildTag.propTypes = {
    tag: PropTypes.object.isRequired,
    parentTagSlug: PropTypes.string.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    currentTagSlugs: PropTypes.array.isRequired,
    onTagClick: PropTypes.func.isRequired
};

export default ChildTag;
