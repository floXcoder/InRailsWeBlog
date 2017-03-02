'use strict';

import {ListItem} from 'material-ui/List';

let ChildTag = ({tag, parentTagName, onClickTag}) => (
    <ListItem className="tag-child"
              value={tag.id}
              primaryText={tag.name.toUpperCase()}
              onClick={(event) => ChildTag._handleTagClick(tag.id, tag.name, parentTagName, onClickTag, event)}/>
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
