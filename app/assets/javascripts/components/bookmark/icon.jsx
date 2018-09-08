'use strict';

import {
    bookmark
} from '../../actions';

import {
    getBookmark
} from '../../selectors';

export default @connect((state, props) => ({
    bookmarkData: getBookmark(state, props)
}), {
    bookmark
})
class BookmarkIcon extends React.PureComponent {
    static propTypes = {
        bookmarkedType: PropTypes.string.isRequired,
        bookmarkedId: PropTypes.number.isRequired,
        isIcon: PropTypes.bool,
        className: PropTypes.string,
        bookmarkCount: PropTypes.number,
        // From connect
        bookmarkData: PropTypes.object,
        bookmark: PropTypes.func
    };

    static defaultProps = {
        isBookmarked: false,
        isIcon: false,
        bookmarkCount: 0
    };

    constructor(props) {
        super(props);
    }

    _handleBookmark = (event) => {
        event.preventDefault();

        this.props.bookmark(this.props.bookmarkedType, this.props.bookmarkedId, this.props.bookmarkData);
    };

    render() {
        const bookmarkText = this.props.bookmarkData ? I18n.t('js.bookmark.common.remove') : I18n.t('js.bookmark.common.add');

        return (
            <div className={classNames(this.props.className || 'bookmark', `bookmark-${this.props.bookmarkedType}`, {
                'bookmarked': this.props.bookmarkData,
                'bookmark-icon-only': this.props.isIcon,
                'tooltip-bottom': this.props.isIcon
            })}
                 data-tooltip={bookmarkText}>
                <a href="#"
                   onClick={this._handleBookmark}>
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
                        this.props.bookmarkData
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
