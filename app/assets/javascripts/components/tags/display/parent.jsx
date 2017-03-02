'use strict';

import {ListItem} from 'material-ui/List';

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
        <ListItem className="tag-parent"
                  value={parentTag.id}
                  primaryText={parentTag.name.toUpperCase()}
                  initiallyOpen={isFiltered}
                  onClick={(event) => ParentTag._handleTagClick(parentTag.id, parentTag.name, null, onClickTag, event)}
                  nestedItems={childItem}/>
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
