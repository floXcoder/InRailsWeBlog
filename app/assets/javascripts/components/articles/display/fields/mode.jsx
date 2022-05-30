'use strict';

function ArticleModeField({
                              currentMode,
                              onModeClick
                          }) {
    return (
        <div className="article-mode-form">
            <div className="row center-align">
                <div className="col s4">
                    <a className={classNames('article-mode-btn', {
                        'article-mode-selected': currentMode === 'story'
                    })}
                       href="#"
                       onClick={onModeClick.bind(this, 'story')}>
                                        <span className="material-icons left"
                                              data-icon="assignment"
                                              aria-hidden="true"/>
                        {I18n.t('js.article.enums.mode.story')}
                    </a>
                </div>

                <div className="col s4">
                    <a className={classNames('article-mode-btn', {
                        'article-mode-selected': currentMode === 'note'
                    })}
                       href="#"
                       onClick={onModeClick.bind(this, 'note')}>
                                        <span className="material-icons left"
                                              data-icon="note"
                                              aria-hidden="true"/>
                        {I18n.t('js.article.enums.mode.note')}
                    </a>
                </div>

                <div className="col s4">
                    <a className={classNames('article-mode-btn', {
                        'article-mode-selected': currentMode === 'link'
                    })}
                       href="#"
                       onClick={onModeClick.bind(this, 'link')}>
                                        <span className="material-icons left"
                                              data-icon="link"
                                              aria-hidden="true"/>
                        {I18n.t('js.article.enums.mode.link')}
                    </a>
                </div>
            </div>
        </div>
    );
}

ArticleModeField.propTypes = {
    currentMode: PropTypes.string.isRequired,
    onModeClick: PropTypes.func.isRequired
};

export default React.memo(ArticleModeField);
