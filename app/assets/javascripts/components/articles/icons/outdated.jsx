'use strict';

export default class ArticleOutdatedIcon extends React.PureComponent {
    static propTypes = {
        articleId: PropTypes.number.isRequired,
        onOutdatedClick: PropTypes.func.isRequired,
        isOwner: PropTypes.bool
    };

    static defaultProps = {
        isOwner: false
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
        if (!this.props.isOwner) {
            return null;
        }

        const outdatedClasses = classNames('material-icons', {'article-outdated': this.state.isOutdated});
        const outdatedTooltip = this.state.isOutdated ? I18n.t('js.article.tooltip.remove_outdated') : I18n.t('js.article.tooltip.add_outdated');

        return (
            <a className="btn-floating tooltip-bottom"
               data-tooltip={outdatedTooltip}
               onClick={this._handleOutdatedClick.bind(this, this.props.articleId)}>
                <span className={outdatedClasses}
                      data-icon="highlight_off"
                      aria-hidden="true"/>
            </a>
        );
    }
}
