'use strict';

import {
    Link
} from 'react-router-dom';

const ChildTag = ({tag, parentTagSlug, isExpanded, onTagClick}) => (
    <Link className={classNames('tag-child tag-child-name', {
        'tag-child-display': isExpanded,
        'tag-selected': window.location.pathname === `/tagged/${parentTagSlug}/${tag.slug}`
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
    onTagClick: PropTypes.func.isRequired
};

export default ChildTag;
