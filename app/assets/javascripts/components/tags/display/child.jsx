'use strict';

import {
    Link
} from 'react-router-dom';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import {
    taggedArticlesPath, taggedTopicArticlesPath
} from '../../../constants/routesHelper';

const ChildTag = ({tag, parentTagSlug, currentChildTagSlug, currentTagSlugs, currentUserSlug, currentUserTopicSlug, onTagClick, classes}) => (
    <ListItem button={true}
              component={Link}
              to={
                  currentUserSlug && currentUserTopicSlug
                      ?
                      taggedTopicArticlesPath(currentUserSlug, currentUserTopicSlug, parentTagSlug, tag.slug)
                      :
                      taggedArticlesPath(parentTagSlug, tag.slug)
              }
              onClick={onTagClick}>
        <ListItemText classes={{
            root: classes.nestedLabelRoot,
            primary: classNames(classes.nestedLabel, {
                [classes.selectedLabel]: currentChildTagSlug ? currentChildTagSlug === tag.slug : currentTagSlugs.includes(tag.slug)
            })
        }}
                      inset={true}>
            {tag.name}
        </ListItemText>
    </ListItem>
);

ChildTag.propTypes = {
    tag: PropTypes.object.isRequired,
    parentTagSlug: PropTypes.string.isRequired,
    currentTagSlugs: PropTypes.array.isRequired,
    onTagClick: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    currentChildTagSlug: PropTypes.string,
    currentUserSlug: PropTypes.string,
    currentUserTopicSlug: PropTypes.string
};

export default React.memo(ChildTag);
