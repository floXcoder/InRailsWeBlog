import {
    createSelector
} from 'reselect';

import I18n from '@js/modules/translations';
import * as Utils from '@js/modules/utils';

export const getCommentErrors = createSelector(
    (state) => state.commentState.errors,
    (errors) => {
        let errorContent;
        if (typeof errors === 'string') {
            errorContent = [errors];
        } else if (Utils.isPresent(errors)) {
            errorContent = [];
            Object.entries(errors).forEach(([errorName, errorDescriptions]) => {
                if (Utils.isPresent(errorDescriptions)) {
                    errorContent.push(I18n.t(`js.comment.model.${errorName}`) + ' ' + (Array.isArray(errorDescriptions) ? errorDescriptions.join(I18n.t('js.helpers.and')) : errorDescriptions));
                }
            });
        }
        return errorContent;
    }
);
