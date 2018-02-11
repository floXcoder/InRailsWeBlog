'use strict';

import {
    NavLink
} from 'react-router-dom';

import {
    spyTrackClick
} from '../../../actions';

const ChildTag = ({tag, parentTagSlug, isExpanded}) => (
    <NavLink className={classNames('tag-child', {
        'tag-child-display': isExpanded
    })}
             to={`/tagged/${parentTagSlug}/${tag.slug}`}
             activeClassName="tag-selected"
             exact={true}
             onClick={spyTrackClick.bind(null, 'tag', tag.id)}>
        <span className="tag-child-name">
            {tag.name}
        </span>
    </NavLink>
);

ChildTag.propTypes = {
    tag: PropTypes.object.isRequired,
    parentTagSlug: PropTypes.string.isRequired,
    isExpanded: PropTypes.bool.isRequired
};

export default ChildTag;
