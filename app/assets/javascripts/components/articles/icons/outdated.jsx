'use strict';

export default class ArticleOutdatedIcon extends React.PureComponent {
    static propTypes = {
        articleId: PropTypes.number.isRequired,
        onOutdatedClick: PropTypes.func.isRequired,
        isUserConnected: PropTypes.bool
    };

    static defaultProps = {
        isUserConnected: false
    };

    constructor(props) {
        super(props);
    }

    // TODO: use redux to mark as outdated then received new data (as bookmark)
    state = {
        // isOutdated: this.props.article.outdated
    };

    _handleOutdatedClick = (articleId, event) => {
        event.preventDefault();
        this.props.onOutdatedClick(articleId, this.state.isOutdated);
        this.setState({isOutdated: !this.state.isOutdated})
    };

    render() {
        if (!this.props.isUserConnected) {
            return null;
        }

        let outdatedClasses = classNames('material-icons', {'article-outdated': this.state.isOutdated});
        let outdatedTooltip = this.state.isOutdated ?
            I18n.t('js.article.tooltip.remove_outdated') :
            I18n.t('js.article.tooltip.add_outdated');

        return (
            <a className="btn-floating tooltipped"
               data-tooltip={outdatedTooltip}
               onClick={this._handleOutdatedClick.bind(this, this.props.articleId)}>
                <i className={outdatedClasses}>highlight_off</i>
            </a>
        );
    }
}
