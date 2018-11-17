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
        isSearching: PropTypes.bool.isRequired,
        onTagClick: PropTypes.func.isRequired,
        highlightedTagIndex: PropTypes.number
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

                    <span className={this.props.classes.categoryCount}>
                        {`(${I18n.t('js.search.index.results', {count: this.props.tags.length})})`}
                    </span>
                </h2>

                <div>
                    {
                        this.props.tags.map((tag) => (
                            <Chip key={tag.id}
                                  className={this.props.classes.tag}
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
