'use strict';

import {
    createSelector
} from 'reselect';

export const getComments = createSelector(
    (state) => state.commentState.comments,
    (comments) => comments.toArray()
);
export const getCommentPagination = createSelector(
    (state) => state.commentState.pagination,
    (pagination) => pagination.toJS()
);

export const getCommentErrors = createSelector(
    (state) => state.commentState.errors,
    (errors) => {
        let errorContent = [];
        if (typeof errors === 'string') {
            errorContent = [errors];
        } else {
            errors.mapKeys((errorName, errorDescriptions) => {
                errorDescriptions = errorDescriptions.toJS();
                errorContent.push(I18n.t(`js.comment.model.${errorName}`) + ' ' + (Array.isArray(errorDescriptions) ? errorDescriptions.join(I18n.t('js.helpers.and')) : errorDescriptions));
            }).toArray();
        }
        return errorContent;
    }
);
