'use strict';

export default class ArticleHistoryIcon extends React.PureComponent {
    static propTypes = {
        article: React.PropTypes.object.isRequired,
        onHistoryClick: React.PropTypes.func.isRequired
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
        if ($app.user.isConnected(this.props.article.user.id)) {
            return (
                <a className="article-history tooltipped btn-floating"
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
