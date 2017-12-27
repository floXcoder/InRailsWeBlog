'use strict';

const ArticleDeleteIcon = ({article, onDeleteClick}) => {
    // TODO: use redux global state instead of $app
    // if ($app.isUserConnected(article.user.id)) {
    //     return (
    //         <a className="btn-floating tooltipped article-delete"
    //            data-tooltip={I18n.t('js.article.tooltip.delete')}
    //            onClick={onDeleteClick}>
    //            <span className="material-icons"
    //                      data-icon="delete"
    //                      aria-hidden="true"/>
    //         </a>
    //     );
    // } else {
        return null;
    // }
};

ArticleDeleteIcon.propTypes = {
    article: PropTypes.object.isRequired,
    onDeleteClick: PropTypes.func.isRequired,
    isUserConnected: PropTypes.bool
};

ArticleDeleteIcon.defaultProps = {
    isUserConnected: false
};

export default ArticleDeleteIcon;
