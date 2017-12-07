'use strict';

export default class ArticleOutdatedIcon extends React.PureComponent {
    static propTypes = {
        article: PropTypes.object.isRequired,
        onOutdatedClick: PropTypes.func.isRequired
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
    }

    state = {
        isOutdated: this.props.article.outdated
    };

    _handleOutdatedClick = (articleId, event) => {
        event.preventDefault();
        this.props.onOutdatedClick(articleId, this.state.isOutdated);
        this.setState({isOutdated: !this.state.isOutdated})
    };

    render() {
        // TODO: use redux global state instead of $app
        if ($app.isUserConnected()) {
            let outdatedClasses = classNames('material-icons', {'article-outdated': this.state.isOutdated});
            let outdatedTooltip = this.state.isOutdated ?
                I18n.t('js.article.tooltip.remove_outdated') :
                I18n.t('js.article.tooltip.add_outdated');

            return (
                <a className="btn-floating tooltipped"
                   data-tooltip={outdatedTooltip}
                   onClick={this._handleOutdatedClick.bind(this, this.props.article.id)}>
                    <i className={outdatedClasses}>highlight_off</i>
                </a>
            );
        } else {
            return null;
        }
    }
}
