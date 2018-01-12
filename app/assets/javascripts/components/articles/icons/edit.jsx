'use strict';

const ArticleEditIcon = ({onEdit, isOwner}) => {
    if (!isOwner) {
        return null;
    }

    return (
        <a className="btn-floating article-edit tooltipped"
           data-tooltip={I18n.t('js.article.tooltip.edit')}
           onClick={onEdit}>
                <span className="material-icons"
                      data-icon="mode_edit"
                      aria-hidden="true"/>
        </a>
    );
};

ArticleEditIcon.propTypes = {
    onEdit: PropTypes.func,
    isOwner: PropTypes.bool
};

ArticleEditIcon.defaultProps = {
    isOwner: false
};

export default ArticleEditIcon;
