'use strict';

export default class SearchSelectedIndex extends React.Component {
    static propTypes = {
        selectedTags: PropTypes.array.isRequired,
        className: PropTypes.string,
        onTagClick: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={classNames('search-category', this.props.className)}>
                <div className="tag-selected-list">
                    {
                        this.props.selectedTags.map((tag) => (
                            <span key={tag.id}
                                  className="tag"
                                  onClick={this.props.onTagClick.bind(null, tag)}>
                                <span className="material-icons tag-icon"
                                      data-icon="label"
                                      aria-hidden="true"/>
                                {tag.name}

                                <a>
                                    <span className="material-icons"
                                          data-icon="close"
                                          aria-hidden="true"/>
                                </a>
                            </span>
                        ))
                    }
                </div>
            </div>
        );
    }
}
