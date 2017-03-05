'use strict';

let ChildTag = ({tag, parentTagName, onClickTag}) => (
    <div className="tag-child"
         onClick={ChildTag._handleTagClick.bind(null, tag.id, tag.name, parentTagName, onClickTag)}>
        {tag.name.toUpperCase()}
    </div>
);

ChildTag.propTypes = {
    tag: React.PropTypes.object.isRequired,
    parentTagName: React.PropTypes.string.isRequired,
    onClickTag: React.PropTypes.func.isRequired
};

ChildTag._handleTagClick = (tagId, tagName, parentTagName, onClickTag, event) => {
    event.preventDefault();
    onClickTag(tagId, parentTagName, tagName);
    return false;
};

export default ChildTag;
