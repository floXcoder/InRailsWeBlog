'use strict';

import ChildTag from './child';

let ParentTag = ({filteredTags, parentTag, isFiltered, onClickTag}) => {
    let childItem = parentTag.children.map((tag, i) => {
        let childTag = filteredTags[tag.id];
        if (childTag) {
            return (
                <ChildTag key={i}
                          tag={childTag}
                          parentTagName={parentTag.name}
                          onClickTag={onClickTag}/>
            );
        }
    });

    return (
        <div className="tag-parent"
             onClick={ParentTag._handleTagClick.bind(null, parentTag.id, parentTag.name, null, onClickTag)}>
            {parentTag.name.toUpperCase()}
            {childItem}
        </div>
    );
};

ParentTag._handleTagClick = (tagId, parentTagName, childTagName, onClickTag, event) => {
    event.preventDefault();
    onClickTag(tagId, parentTagName, childTagName);
    return false;
};

ParentTag.propTypes = {
    filteredTags: React.PropTypes.array.isRequired,
    parentTag: React.PropTypes.object.isRequired,
    onClickTag: React.PropTypes.func.isRequired,
    isFiltered: React.PropTypes.bool
};

ParentTag.defaultProps = {
    isFiltered: false
};

export default ParentTag;
