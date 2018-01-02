'use strict';

import {
    NavLink
} from 'react-router-dom';

const ChildTag = ({tag, parentTagSlug}) => (
    <NavLink className="tag-child"
             to={`/tagged/${parentTagSlug}/${tag.slug}`}>
        <div className="tag-child-name">
            {tag.name}
        </div>
    </NavLink>
);

ChildTag.propTypes = {
    tag: PropTypes.object.isRequired,
    parentTagSlug: PropTypes.string.isRequired
};

export default ChildTag;
