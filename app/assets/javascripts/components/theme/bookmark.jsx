'use strict';

import UserActions from '../../actions/userActions';
import UserStore from '../../stores/userStore';

export default class Bookmark extends Reflux.Component {
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

        this.mapStoreToState(UserStore, this.onUserChange);
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

    componentDidMount() {
        if (this.props.isIcon) {
            $(ReactDOM.findDOMNode(this)).find('.tooltipped').tooltip();
        }
    }

    componentDidUpdate() {
        if (this.props.isIcon) {
            $(ReactDOM.findDOMNode(this)).find('.tooltipped').tooltip();
        }
    }

    onUserChange = (bookmarkData) => {
        if ($.isEmpty(bookmarkData)) {
            return;
        }

        let newState = {};

        if (bookmarkData.type === 'bookmark') {
            if (this.props.modelName === bookmarkData.bookmark.bookmarked_model && this.props.modelId === bookmarkData.bookmark.bookmarked_id) {
                newState.isBookmarked = !this.state.isBookmarked;
            }
        }

        if (!$.isEmpty(newState)) {
            this.setState(newState);
        }
    };

    _handleBookmarkClick = (event) => {
        event.preventDefault();

        UserActions.bookmark($.currentUserId(), this.props.modelId, this.props.modelName, this.state.isBookmarked);
    };

    render() {
        const bookmarkText = this.state.isBookmarked ? I18n.t('js.bookmark.common.remove') : I18n.t('js.bookmark.common.add');

        return (
            <div className={classNames('bookmark', `bookmark-${this.props.modelName}`, {
                'bookmarked': this.state.isBookmarked,
                'bookmark-icon-only': this.props.isIcon,
                'tooltipped': this.props.isIcon
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
                            <i className="material-icons bookmark-icon">favorite</i>
                            :
                            <i className="material-icons bookmark-icon">favorite_border</i>
                    }
                </a>
            </div>
        );
    }
}

