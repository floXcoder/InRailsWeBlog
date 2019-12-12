'use strict';

import {
    createSelector
} from 'reselect';

export const getCommentErrors = createSelector(
    (state) => state.commentState.errors,
    (errors) => {
        let errorContent = undefined;
        if (typeof errors === 'string') {
            errorContent = [errors];
        } else if(!Utils.isEmpty(errors)) {
            errorContent = [];
            Object.entries(errors).forEach(([errorName, errorDescriptions]) => {
                errorContent.push(I18n.t(`js.comment.model.${errorName}`) + ' ' + (Array.isArray(errorDescriptions) ? errorDescriptions.join(I18n.t('js.helpers.and')) : errorDescriptions));
            });
        }
        return errorContent;
    }
);
