'use strict';

import {
    bookmark
} from '../../actions';

import {
    getIsBookmarked
} from '../../selectors';

@connect((state, props) => ({
    isBookmarked: getIsBookmarked(state, props)
}), {
    bookmark
})
export default class BookmarkIcon extends React.PureComponent {
    static propTypes = {
        bookmarkType: PropTypes.string.isRequired,
        bookmarkId: PropTypes.number.isRequired,
        bookmarkedId: PropTypes.number,
        isIcon: PropTypes.bool,
        bookmarkCount: PropTypes.number,
        // From connect
        isBookmarked: PropTypes.bool,
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

        this.props.bookmark(this.props.bookmarkType, this.props.bookmarkId, this.props.bookmarkedId);
    };

    render() {
        const bookmarkText = this.props.isBookmarked ? I18n.t('js.bookmark.common.remove') : I18n.t('js.bookmark.common.add');

        return (
            <div className={classNames('bookmark', `bookmark-${this.props.bookmarkType}`, {
                'bookmarked': this.props.isBookmarked,
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
                        this.props.isBookmarked
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

