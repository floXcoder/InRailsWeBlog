'use strict';

import {
    Link
} from 'react-router-dom';

import {
    spyTrackClick
} from '../../../actions';

export default class SearchTagIndex extends React.Component {
    static propTypes = {
        tags: PropTypes.array.isRequired,
        isSearching: PropTypes.bool.isRequired,
        onTagClick: PropTypes.func.isRequired,
        highlightedTagIndex: PropTypes.number
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="search-index-category">
                <h2>
                    {I18n.t('js.search.module.tags.title')}

                    <span className="search-index-count">
                        {`(${I18n.t('js.search.index.results', {count: this.props.tags.length})})`}
                    </span>
                </h2>

                <div className="tag-list">
                    {
                        this.props.tags.limit(12).map((tag) => (
                            <span key={tag.id}
                                  className="tag"
                                  onClick={this.props.onTagClick.bind(null, tag)}>
                                <span className="material-icons tag-icon"
                                      data-icon="label"
                                      aria-hidden="true"/>
                                {tag.name}

                                <Link className="tag-link"
                                      to={`/tagged/${tag.slug}`}
                                      onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.name)}>
                                    <span className="material-icons"
                                          data-icon="open_in_new"
                                          aria-hidden="true"/>
                                </Link>
                            </span>
                        ))
                    }
                </div>
            </div>
        );
    }
}
