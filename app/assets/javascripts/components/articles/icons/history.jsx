'use strict';

export default class ArticleHistoryIcon extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        onHistoryClick: PropTypes.func.isRequired
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        $('.article-history.tooltipped').tooltip();
    }

    componentWillUpdate() {
        $('.article-history.tooltipped').tooltip('remove');
    }

    componentDidUpdate() {
        $('.article-history.tooltipped').tooltip();
    }

    render() {
        // TODO: use redux global state instead of $app
        if ($app.isUserConnected(this.props.article.user.id)) {
            return (
                <a className="btn-floating tooltipped article-history"
                   data-tooltip={I18n.t('js.article.tooltip.history')}
                   onClick={this.props.onHistoryClick}>
                    <i className="material-icons">history</i>
                </a>
            );
        } else {
            return null;
        }
    }
}
