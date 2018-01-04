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
    (commentErrors) => commentErrors.mapEntries((errorName, errorDescription) => I18n.t(`js.comment.model.${errorName}`) + ' ' + (Array.isArray(errorDescription) ? errorDescription.join(I18n.t('js.helpers.and')) : errorDescription)).toArray()
);
