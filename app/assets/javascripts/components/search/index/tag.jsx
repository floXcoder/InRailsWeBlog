'use strict';

import {
    Link
} from 'react-router-dom';

import Chip from '@material-ui/core/Chip';

import LabelIcon from '@material-ui/icons/Label';

import {
    taggedArticlesPath
} from '../../../constants/routesHelper';

import {
    spyTrackClick
} from '../../../actions';

export default class SearchTagIndex extends React.PureComponent {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        tags: PropTypes.array.isRequired,
        onTagClick: PropTypes.func.isRequired,
        highlightedTagId: PropTypes.number,
        isAutocomplete: PropTypes.bool,
        // From animation
        style: PropTypes.object
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
            <div className={classNames(this.props.classes.category, {
                [this.props.classes.categoryAutocomplete]: this.props.isAutocomplete
            })}
                 style={this.props.style}>
                {
                    this.props.isAutocomplete &&
                    <span className={this.props.classes.categoryHelper}>
                        {I18n.t('js.search.index.tags.filter')}
                    </span>
                }

                {
                    this.props.tags.map((tag) => (
                        <Chip key={tag.id}
                              className={classNames(this.props.classes.articleTag, {
                                  [this.props.classes.tagHighlighted]: this.props.highlightedTagId === tag.id,
                                  [this.props.classes.tagAutocomplete]: this.props.isAutocomplete
                              })}
                              icon={<LabelIcon fontSize={this.props.isAutocomplete ? 'small' : 'default'}/>}
                              label={tag.name}
                              color="primary"
                              variant="outlined"
                              component={Link}
                              to={taggedArticlesPath(tag.slug)}
                              onClick={this._handleTagClick.bind(this, tag)}/>
                    ))
                }
            </div>
        );
    }
}
