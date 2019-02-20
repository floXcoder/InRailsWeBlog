'use strict';

import {
    Link
} from 'react-router-dom';

import Chip from '@material-ui/core/Chip';

import LabelIcon from '@material-ui/icons/Label';

import {
    spyTrackClick
} from '../../../actions';

export default class SearchTagIndex extends React.PureComponent {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        tags: PropTypes.array.isRequired,
        onTagClick: PropTypes.func.isRequired,
        highlightedTagId: PropTypes.number
    };

    constructor(props) {
        super(props);
    }

    _handleTagClick = (tag, event) => {
        event.preventDefault();

        spyTrackClick('tag', tag.id, tag.slug, tag.name);

        this.props.onTagClick(tag);
    };

    render() {
        return (
            <div className={this.props.classes.category}>
                {
                    this.props.tags.map((tag) => (
                        <Chip key={tag.id}
                              className={classNames(this.props.classes.articleTag, {
                                  [this.props.classes.tagHighlighted]: this.props.highlightedTagId === tag.id
                              })}
                              icon={<LabelIcon/>}
                              label={tag.name}
                              color="primary"
                              variant="outlined"
                              component={Link}
                              to={`/tagged/${tag.slug}`}
                              onClick={this._handleTagClick.bind(this, tag)}/>
                    ))
                }
            </div>
        );
    }
}
