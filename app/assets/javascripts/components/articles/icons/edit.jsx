'use strict';

const ArticleEditIcon = ({onEditClick, isOwner}) => {
    if (!isOwner) {
        return null;
    }

    return (
        <a className="btn-floating article-edit tooltipped"
           data-tooltip={I18n.t('js.article.tooltip.edit')}
           onClick={onEditClick}>
                <span className="material-icons"
                      data-icon="mode_edit"
                      aria-hidden="true"/>
        </a>
    );
};

ArticleEditIcon.propTypes = {
    onEditClick: PropTypes.func,
    isOwner: PropTypes.bool
};

ArticleEditIcon.defaultProps = {
    isOwner: false
};

export default ArticleEditIcon;
