'use strict';

export default class ArticleHistoryIcon extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        onHistoryClick: PropTypes.func.isRequired,
        isUserConnected: PropTypes.bool
    };

    static defaultProps = {
        isUserConnected: false
    };

    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.isUserConnected) {
            return null;
        }

        return (
            <a className="btn-floating tooltipped article-history"
               data-tooltip={I18n.t('js.article.tooltip.history')}
               onClick={this.props.onHistoryClick}>
                <i className="material-icons">history</i>
            </a>
        );
    }
}
