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


export default class SearchTagIndex extends React.PureComponent {
    static propTypes = {
        tags: PropTypes.array.isRequired,
        onTagClick: PropTypes.func.isRequired,
        highlightedTagId: PropTypes.number,
        isAutocomplete: PropTypes.bool
    };

    constructor(props) {
        super(props);
    }

    _handleTagClick = (tag, event) => {
        event.preventDefault();

        spyTrackClick('tag', tag.id, tag.slug, tag.userId, tag.name, null);

        this.props.onTagClick(tag);
    };

    render() {
        return (
            <div className={classNames('search-index-category', {
                'search-index-category-autocomplete': this.props.isAutocomplete
            })}>
                {
                    !!this.props.isAutocomplete &&
                    <span className="search-index-category-helper">
                        {I18n.t('js.search.index.tags.filter')}
                    </span>
                }

                {
                    this.props.tags.map((tag) => (
                        <Chip key={tag.id}
                              className={classNames('search-index-article-tag', {
                                  'search-index-tag-highlighted': this.props.highlightedTagId === tag.id,
                                  'search-index-tag-autocomplete': this.props.isAutocomplete
                              })}
                              icon={<LabelIcon fontSize={this.props.isAutocomplete ? 'small' : 'medium'}/>}
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
