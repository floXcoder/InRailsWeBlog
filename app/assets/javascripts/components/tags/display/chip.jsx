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


export default class TagChipDisplay extends React.Component {
    static propTypes = {
        tag: PropTypes.object.isRequired,
        isLarge: PropTypes.bool
    };

    static defaultProps = {
        isLarge: false
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Chip className={classNames('tag-chip-tagChip', {
                'tag-chip-tagChipLarge': this.props.isLarge
            })}
                  icon={<LabelIcon/>}
                  label={this.props.tag.name}
                  color="primary"
                  variant="outlined"
                  component={Link}
                  to={taggedArticlesPath(this.props.tag.slug)}
                  onClick={spyTrackClick.bind(null, 'tag', this.props.tag.id, this.props.tag.slug, this.props.tag.userId, this.props.tag.name, null)}/>
        );
    }
}
