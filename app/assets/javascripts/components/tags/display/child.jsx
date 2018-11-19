'use strict';

import {
    Link
} from 'react-router-dom';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const ChildTag = ({tag, parentTagSlug, isExpanded, currentTagSlugs, onTagClick, classes}) => (
    <ListItem button={true}
              component={Link}
              className={classes.nestedLabel}
              to={`/tagged/${parentTagSlug}/${tag.slug}`}
              onClick={onTagClick}>
        <ListItemText classes={{
            primary: classNames({
                [classes.selectedLabel]: currentTagSlugs.includes(tag.slug)
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
    classes: PropTypes.object.isRequired
};

export default ChildTag;
