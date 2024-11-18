'use strict';

import {
    Link
} from 'react-router-dom';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import {
    taggedArticlesPath, taggedTopicArticlesPath
} from '../../../constants/routesHelper';

function ChildTag({
                      tag,
                      parentTagSlug,
                      currentChildTagSlug,
                      currentTagSlugs,
                      currentUserSlug,
                      currentUserTopicSlug,
                      onTagClick
                  }) {
    return (
        <ListItemButton component={Link}
                        to={
                            currentUserSlug && currentUserTopicSlug
                                ?
                                taggedTopicArticlesPath(currentUserSlug, currentUserTopicSlug, parentTagSlug, tag.slug)
                                :
                                taggedArticlesPath(parentTagSlug, tag.slug)
                        }
                        onClick={onTagClick}>
            <ListItemText classes={{
                root: 'tag-sidebar-nested-label-root',
                primary: classNames('tag-sidebar-nested-label', {
                    'tag-sidebar-selected-label': currentChildTagSlug ? currentChildTagSlug === tag.slug : currentTagSlugs.includes(tag.slug)
                })
            }}
                          inset={true}>
                {tag.name}
            </ListItemText>
        </ListItemButton>
    );
}

ChildTag.propTypes = {
    tag: PropTypes.object.isRequired,
    parentTagSlug: PropTypes.string.isRequired,
    currentTagSlugs: PropTypes.array.isRequired,
    onTagClick: PropTypes.func.isRequired,
    currentChildTagSlug: PropTypes.string,
    currentUserSlug: PropTypes.string,
    currentUserTopicSlug: PropTypes.string
};

export default React.memo(ChildTag);
