'use strict';

export default class ArticleBookmarkIcon extends React.PureComponent {
    static propTypes = {
        article: PropTypes.object.isRequired,
        onBookmarkClick: PropTypes.func.isRequired
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
    }

    state = {
        isBookmarked: this.props.article.bookmarked
    };

    _handleBookmarkClick = (articleId, event) => {
        event.preventDefault();
        this.props.onBookmarkClick(articleId, this.state.isBookmarked);
        this.setState({isBookmarked: !this.state.isBookmarked})
    };

    render() {
        if ($app.isUserConnected()) {
            let bookmarkClasses = classNames('material-icons', {'article-bookmarked': this.state.isBookmarked});
            let bookmarkTooltip = this.state.isBookmarked ?
                I18n.t('js.article.tooltip.remove_bookmark') :
                I18n.t('js.article.tooltip.add_bookmark');

            return (
                <a className="tooltipped btn-floating"
                   data-tooltip={bookmarkTooltip}
                   onClick={this._handleBookmarkClick.bind(this, this.props.article.id)}>
                    <i className={bookmarkClasses}>bookmark</i>
                </a>
            );
        } else {
            return null;
        }
    }
}
