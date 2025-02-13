import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import classNames from 'classnames';

import FavoriteIcon from '@mui/icons-material/FavoriteOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorderOutlined';

import I18n from '@js/modules/translations';

import {
    bookmark
} from '@js/actions/bookmarkActions';

import {
    getBookmark
} from '@js/selectors/bookmarkSelectors';


class BookmarkIcon extends React.PureComponent {
    static propTypes = {
        bookmarkedType: PropTypes.string.isRequired,
        bookmarkedId: PropTypes.number.isRequired,
        className: PropTypes.string,
        bookmarkCount: PropTypes.number,
        isIcon: PropTypes.bool,
        size: PropTypes.oneOf(['small', 'medium', 'large']),
        color: PropTypes.oneOf(['primary', 'secondary', 'action']),
        // from connect
        bookmarkData: PropTypes.object,
        bookmark: PropTypes.func
    };

    static defaultProps = {
        bookmarkCount: 0,
        isIcon: false,
        size: 'medium',
        color: 'primary'
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

        if (this.props.isIcon) {
            return (
                <span
                    className={classNames('flow-tooltip-bottom', this.props.className, `bookmark-${this.props.bookmarkedType}`)}
                    data-tooltip={bookmarkText}>
                    <a href="#"
                       onClick={this._handleBookmark}>
                        {
                            this.props.bookmarkData
                                ?
                                <FavoriteIcon color={this.props.color}
                                              fontSize={this.props.size}/>
                                :
                                <FavoriteBorderIcon color={this.props.color}
                                                    fontSize={this.props.size}/>
                        }
                    </a>
                </span>
            );
        } else {
            return (
                <span
                    className={classNames(this.props.className || 'bookmark', `bookmark-${this.props.bookmarkedType}`, {
                        bookmarked: this.props.bookmarkData
                    })}>
                    <a href="#"
                       onClick={this._handleBookmark}>
                        <span>
                            {bookmarkText}
                        </span>

                        {
                            this.props.bookmarkCount !== 0 &&
                            <span>
                                {` (${this.props.bookmarkCount})`}
                            </span>
                        }
                    </a>
                </span>
            );
        }
    }
}

export default connect((state, props) => ({
    bookmarkData: getBookmark(state, props)
}), {
    bookmark
})(BookmarkIcon);