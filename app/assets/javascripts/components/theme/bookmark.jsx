'use strict';

export default class Bookmark extends React.Component {
    static propTypes = {
        modelId: PropTypes.number.isRequired,
        modelName: PropTypes.string.isRequired,
        isBookmarked: PropTypes.bool,
        isIcon: PropTypes.bool,
        bookmarkCount: PropTypes.number
    };

    static defaultProps = {
        isBookmarked: false,
        isIcon: false,
        bookmarkCount: 0
    };

    constructor(props) {
        super(props);
    }

    state = {
        isBookmarked: (() => {
            if (this.props.isBookmarked === true) {
                return true;
            } else {
                let isLocalBookmarked = false;
                const savedBookmarks = UserStore.getLocalData('bookmark');

                if (savedBookmarks) {
                    savedBookmarks.map((bookmark) => {
                        if (bookmark.bookmarked_id === this.props.modelId && bookmark.bookmarked_model === this.props.modelName) {
                            isLocalBookmarked = true;
                        }
                    });
                }

                return isLocalBookmarked;
            }
        })()
    };

    onUserChange = (bookmarkData) => {
        if (Utils.isEmpty(bookmarkData)) {
            return;
        }

        let newState = {};

        if (bookmarkData.type === 'bookmark') {
            if (this.props.modelName === bookmarkData.bookmark.bookmarked_model && this.props.modelId === bookmarkData.bookmark.bookmarked_id) {
                newState.isBookmarked = !this.state.isBookmarked;
            }
        }

        if (!Utils.isEmpty(newState)) {
            this.setState(newState);
        }
    };

    _handleBookmarkClick = (event) => {
        event.preventDefault();

        // TODO
        // UserActions.bookmark(Utils.currentUserId(), this.props.modelId, this.props.modelName, this.state.isBookmarked);
    };

    render() {
        const bookmarkText = this.state.isBookmarked ? I18n.t('js.bookmark.common.remove') : I18n.t('js.bookmark.common.add');

        return (
            <div className={classNames('bookmark', `bookmark-${this.props.modelName}`, {
                'bookmarked': this.state.isBookmarked,
                'bookmark-icon-only': this.props.isIcon,
                'tooltip-bottom': this.props.isIcon
            })}
                 data-tooltip={bookmarkText}>
                <a href="#"
                   onClick={this._handleBookmarkClick}>
                    {
                        !this.props.isIcon &&
                        <span>
                            {bookmarkText}
                        </span>
                    }

                    {
                        this.props.bookmarkCount !== 0 &&
                        <span>
                            {` (${this.props.bookmarkCount})`}
                        </span>
                    }

                    {
                        this.state.isBookmarked
                            ?
                            <span className="material-icons bookmark-icon"
                                  data-icon="favorite"
                                  aria-hidden="true"/>
                            :
                            <span className="material-icons bookmark-icon"
                                  data-icon="favorite_border"
                                  aria-hidden="true"/>
                    }
                </a>
            </div>
        );
    }
}

