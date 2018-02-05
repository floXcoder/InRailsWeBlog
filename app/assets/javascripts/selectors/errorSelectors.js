'use strict';

import {
    createSelector
} from 'reselect';

export const getFailures = createSelector(
    (state) => state.errorState.failures,
    (failures) => failures.toJS()
);
