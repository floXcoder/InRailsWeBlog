'use strict';

export default class ArticleEditionIcons extends React.Component {
    static propTypes = {
        articleUserId: PropTypes.object.isRequired,
        onDeleteClick: PropTypes.func.isRequired,
        onCancelClick: PropTypes.func.isRequired,
        onSaveClick: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    // TODO: use semantic tooltip
    // componentDidMount() {
    //     $('.article-edition .tooltipped').tooltip('remove');
    // }
    //
    // componentWillUnmount() {
    //     $('.article-editing .tooltipped').tooltip('remove');
    // }

    render() {
        // TODO: use global user state
        // if ($app.isUserConnected(this.props.article.user.id)) {
        //     return (
        //         <div className="article-editing">
        //             <a className="article-delete tooltipped btn-floating"
        //                data-tooltip={I18n.t('js.article.tooltip.delete')}
        //                onClick={this.props.onDeleteClick}>
        //                 <i className="material-icons">delete</i>
        //             </a>
        //
        //             <a className="article-cancel tooltipped btn-floating"
        //                data-tooltip={I18n.t('js.article.tooltip.cancel')}
        //                onClick={this.props.onCancelClick}>
        //                 <i className="material-icons">clear</i>
        //             </a>
        //
        //             <a className="article-update tooltipped btn-floating"
        //                data-tooltip={I18n.t('js.article.tooltip.update')}
        //                onClick={this.props.onSaveClick}>
        //                 <i className="material-icons">check</i>
        //             </a>
        //         </div>
        //     );
        // }

        return null;
    }
}
