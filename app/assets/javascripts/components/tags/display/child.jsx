'use strict';

import {
    Link
} from 'react-router-dom';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import {
    taggedArticlesPath
} from '../../../constants/routesHelper';

const ChildTag = ({tag, parentTagSlug, isExpanded, currentChildTagSlug, currentTagSlugs, onTagClick, classes}) => (
    <ListItem button={true}
              component={Link}
              to={taggedArticlesPath(parentTagSlug, tag.slug)}
              onClick={onTagClick}>
        <ListItemText classes={{
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
    isExpanded: PropTypes.bool.isRequired,
    currentTagSlugs: PropTypes.array.isRequired,
    onTagClick: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    currentChildTagSlug: PropTypes.string
};

export default React.memo(ChildTag);
