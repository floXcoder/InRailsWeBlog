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


export const formatTagArticles = (formData, articleTags = [], params = {}) => {
    if (formData.parent_tags) {
        formData.parent_tags = formData.parent_tags.map((parentTag) => ({
            name: parentTag.value,
            visibility: parentTag.category,
            new: parentTag.isNew
        }));
    } else if (articleTags.length > 0) {
        formData.parent_tags = [];
        if (params.parentTagIds) {
            formData.parent_tags = articleTags.filter((tag) => params.parentTagIds.includes(tag.id));
        } else if (params.parentTagSlugs) {
            formData.parent_tags = articleTags.filter((tag) => params.parentTagSlugs.includes(tag.slug));
        }
        formData.parent_tags = formData.parent_tags.map((tag) => ({
            name: tag.name,
            visibility: tag.visibility,
            new: false
        }));
    }

    if (formData.child_tags) {
        formData.child_tags = formData.child_tags.map((childTag) => ({
            name: childTag.value,
            visibility: childTag.category,
            new: childTag.isNew
        }));
    } else if (articleTags.length > 0) {
        formData.child_tags = [];
        if (params.childTagIds) {
            formData.child_tags = articleTags.filter((tag) => params.childTagIds.includes(tag.id));
        } else if (params.childTagSlugs) {
            formData.child_tags = articleTags.filter((tag) => params.childTagSlugs.includes(tag.slug));
        }
        formData.child_tags = formData.child_tags.map((tag) => ({
            name: tag.name,
            visibility: tag.visibility,
            new: false
        }));
    }

    if ((formData.parent_tags && formData.parent_tags.length > 0) && (!formData.child_tags || formData.child_tags.length === 0)) {
        formData.tags = formData.parent_tags;
        delete formData.parent_tags;
        delete formData.child_tags;
    } else if ((!formData.parent_tags || formData.parent_tags.length === 0) && (formData.child_tags && formData.child_tags.length > 0)) {
        formData.tags = formData.child_tags;
        delete formData.parent_tags;
        delete formData.child_tags;
    }
};
