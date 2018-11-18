'use strict';

import {
    Link
} from 'react-router-dom';

import Chip from '@material-ui/core/Chip';

import LabelIcon from '@material-ui/icons/Label';

import {
    spyTrackClick
} from '../../../actions';

export default class SearchTagModule extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        tags: PropTypes.array.isRequired,
        hasQuery: PropTypes.bool.isRequired,
        onTagClick: PropTypes.func.isRequired,
        selectedTags: PropTypes.array,
        highlightedTagIndex: PropTypes.number
    };

    static defaultProps = {
        selectedTags: []
    };

    constructor(props) {
        super(props);
    }

    _handleTagClick = (tag, event) => {
        spyTrackClick('tag', tag.id, tag.slug, tag.name);

        this.props.onTagClick(tag);
    };

    render() {
        return (
            <div className={this.props.classes.category}>
                <h2 className={this.props.classes.categoryName}>
                    {I18n.t('js.search.module.tags.title')}
                    {
                        this.props.hasQuery &&
                        <span className={this.props.classes.categoryCount}>
                            {I18n.t('js.search.module.tags.recents')}
                        </span>
                    }
                </h2>

                <div>
                    {
                        this.props.tags.map((tag, i) => (
                            <Chip key={tag.id}
                                  className={classNames(this.props.classes.tag, {
                                      [this.props.classes.tagSelected]: this.props.selectedTags.includes(tag),
                                      [this.props.classes.tagHighlighted]: this.props.highlightedTagIndex === i
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
            </div>
        );
    }
}
