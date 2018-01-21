'use strict';

import {
    NavLink
} from 'react-router-dom';

import {
    spyTrackClick
} from '../../../actions';

const ChildTag = ({tag, parentTagSlug}) => (
    <NavLink className="tag-child"
             to={`/tagged/${parentTagSlug}/${tag.slug}`}
             onClick={spyTrackClick.bind(null, 'tag', tag.id)}>
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
