'use strict';

// TODO: use connect for article bookmarked and user is connected
export default class ArticleBookmarkIcon extends React.PureComponent {
    static propTypes = {
        articleId: PropTypes.number.isRequired,
        isUserConnected: PropTypes.bool,
        onBookmarkClick: PropTypes.func
    };

    static defaultProps = {
        isUserConnected: false
    };

    constructor(props) {
        super(props);
    }

    // TODO: do not use state but add action to directly modify article in global state
    // state = {
    //     isBookmarked: this.props.article.bookmarked
    // };

    _handleBookmarkClick = (articleId, event) => {
        event.preventDefault();

        // TODO
        // this.props.onBookmarkClick(articleId, this.state.isBookmarked);
        // this.setState({isBookmarked: !this.state.isBookmarked})
    };

    render() {
        if (!this.props.isUserConnected) {
            return null;
        }

        let bookmarkClasses = classNames('material-icons', {'article-bookmarked': this.state.isBookmarked});
        let bookmarkTooltip = this.state.isBookmarked ?
            I18n.t('js.article.tooltip.remove_bookmark') :
            I18n.t('js.article.tooltip.add_bookmark');

        return (
            <a className="btn-floating tooltipped"
               data-tooltip={bookmarkTooltip}
               onClick={this._handleBookmarkClick.bind(this, this.props.articleId)}>
                <i className={bookmarkClasses}>bookmark</i>
            </a>
        );
    }
}
