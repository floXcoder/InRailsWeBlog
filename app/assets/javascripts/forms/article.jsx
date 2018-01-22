'use strict';

export const validateArticle = (values) => {
    const errors = {};

    const title = values.get('title');
    if (title) {
        // I18n.t('js.article.common.tooltips.title_too_short');
        if (title.length < window.settings.article_title_min_length || title.length > window.settings.article_title_max_length) {
            errors.title = I18n.t('js.article.errors.title.size', {
                min: window.settings.article_title_min_length,
                max: window.settings.article_title_max_length
            });
        }
    }

    const summary = values.get('summary');
    if (summary) {
        // I18n.t('js.article.common.tooltips.summary_too_short');
        if (summary.length < window.settings.article_summary_min_length || summary.length > window.settings.article_summary_max_length) {
            errors.summary = I18n.t('js.article.errors.summary.size', {
                min: window.settings.article_summary_min_length,
                max: window.settings.article_summary_max_length
            });
        }
    }

    let content = values.get('content');
    if (content) {
        content = content.replace(/<(?:.|\n)*?>/gm, '');
        if (content.length < window.settings.article_content_min_length || content.length > window.settings.article_content_max_length) {
            errors.content = I18n.t('js.article.errors.content.size', {
                min: window.settings.article_content_min_length,
                max: window.settings.article_content_max_length
            });
        }
    } else {
        errors.content = I18n.t('js.article.common.tooltips.content_too_short');
    }

    return errors;
};
