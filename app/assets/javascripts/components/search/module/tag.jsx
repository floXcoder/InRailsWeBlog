'use strict';

import {
    Link
} from 'react-router-dom';

export default class SearchTagModule extends React.Component {
    static propTypes = {
        tags: PropTypes.array.isRequired,
        isSearching: PropTypes.bool.isRequired,
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

    render() {
        return (
            <div className="search-category">
                <h2>
                    {I18n.t('js.search.module.tags.title')}
                </h2>

                <div className="tag-list">
                    {
                        this.props.tags.limit(12).map((tag, i) => (
                            <span key={tag.id}
                                  className={classNames('tag', {
                                      'tag-selected': this.props.selectedTags.includes(tag),
                                      'tag-highlighted': this.props.highlightedTagIndex === i
                                  })}
                                  onClick={this.props.onTagClick.bind(null, tag)}>
                                <span className="material-icons tag-icon"
                                      data-icon="label"
                                      aria-hidden="true"/>
                                {tag.name}

                                <Link className="tag-link"
                                      to={`/tagged/${tag.slug}`}>
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
