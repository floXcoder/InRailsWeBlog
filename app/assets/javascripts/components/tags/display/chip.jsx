'use strict';

import {
    Link
} from 'react-router-dom';

import Chip from '@mui/material/Chip';

import LabelIcon from '@mui/icons-material/Label';

import {
    taggedArticlesPath
} from '../../../constants/routesHelper';

import {
    spyTrackClick
} from '../../../actions';


function TagChipDisplay({
                            tag,
                            isLarge = false
                        }) {
    return (
        <Chip className={classNames('tag-chip-tag-chip', {
            'tag-chip-tag-chip-large': isLarge
        })}
              icon={<LabelIcon/>}
              label={tag.name}
              color="primary"
              variant="outlined"
              component={Link}
              to={taggedArticlesPath(tag.slug)}
              onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.userId, tag.name, null)}/>
    );
}

TagChipDisplay.propTypes = {
    tag: PropTypes.object.isRequired,
    isLarge: PropTypes.bool
};

export default TagChipDisplay;
