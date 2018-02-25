'use strict';

// TODO: use connect for article bookmarked and user is connected
export default class ArticleBookmarkIcon extends React.PureComponent {
    static propTypes = {
        articleId: PropTypes.number.isRequired,
        isOwner: PropTypes.bool,
        onBookmarkClick: PropTypes.func
    };

    static defaultProps = {
        isOwner: false
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

        // this.props.onBookmarkClick(articleId, this.state.isBookmarked);
        // this.setState({isBookmarked: !this.state.isBookmarked})
    };

    render() {
        if (!this.props.isOwner) {
            return null;
        }

        // TODO
        const bookmarkClasses = classNames('material-icons', {'article-bookmarked': false /* this.state.isBookmarked */});
        // const bookmarkTooltip = this.state.isBookmarked ? I18n.t('js.article.tooltip.remove_bookmark') : I18n.t('js.article.tooltip.add_bookmark');
        const bookmarkTooltip = I18n.t('js.article.tooltip.add_bookmark');

        return (
            <a className="btn-floating tooltip-bottom"
               data-tooltip={bookmarkTooltip}
               onClick={this._handleBookmarkClick.bind(this, this.props.articleId)}>
                <span className={bookmarkClasses}
                      data-icon="bookmark"
                      aria-hidden="true"/>
            </a>
        );
    }
}
