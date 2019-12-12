'use strict';

import {
    createSelector
} from 'reselect';

// Locales
export const getCurrentLocale = () => (
    window.locale
);

export const getSidebarState = createSelector(
    (state) => state.uiState.isTagSidebarOpen,
    (_, isCloud) => isCloud,
    (isTagSidebarOpen, isCloud) => isCloud ? true : isTagSidebarOpen
);
