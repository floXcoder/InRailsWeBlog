'use strict';

export default class ArticleEditionIcons extends React.Component {
    static propTypes = {
        onDeleteClick: PropTypes.func.isRequired,
        onCancelClick: PropTypes.func.isRequired,
        onSaveClick: PropTypes.func.isRequired,
        isOwner: PropTypes.bool
    };

    static defaultProps = {
        isOwner: false
    };

    constructor(props) {
        super(props);
    }

    render() {
        if (!this.props.isOwner) {
            return null;
        }

        return (
            <div className="article-editing">
                <a className="btn-floating article-delete tooltipped"
                   data-tooltip={I18n.t('js.article.tooltip.delete')}
                   onClick={this.props.onDeleteClick}>
                    <span className="material-icons"
                          data-icon="delete"
                          aria-hidden="true"/>
                </a>

                <a className="article-cancel tooltipped btn-floating"
                   data-tooltip={I18n.t('js.article.tooltip.cancel')}
                   onClick={this.props.onCancelClick}>
                    <span className="material-icons"
                          data-icon="clear"
                          aria-hidden="true"/>
                </a>

                <a className="btn-floating article-update tooltipped"
                   data-tooltip={I18n.t('js.article.tooltip.update')}
                   onClick={this.props.onSaveClick}>
                   <span className="material-icons"
                         data-icon="check"
                         aria-hidden="true"/>
                </a>
            </div>
        );
    }
}
