'use strict';

const ChildTag = ({tag, parentTagSlug, onClickTag}) => (
    <div className="tag-child"
         onClick={_handleTagClick.bind(null, tag.slug, tag.slug, parentTagSlug, onClickTag)}>
        <div className="tag-child-name">
            {tag.name}
        </div>
    </div>
);

const _handleTagClick = (tagSlug, parentTagSlug, childTagSlug, onClickTag, event) => {
    event.preventDefault();

    onClickTag(tagSlug, parentTagSlug, childTagSlug);
};

ChildTag.propTypes = {
    tag: PropTypes.object.isRequired,
    parentTagSlug: PropTypes.string.isRequired,
    onClickTag: PropTypes.func.isRequired
};

export default ChildTag;
