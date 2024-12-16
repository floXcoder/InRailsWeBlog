
import {
    createSelector
} from 'reselect';

export const getSidebarState = createSelector(
    (state) => state.uiState.isTagSidebarOpen,
    (_, isCloud) => isCloud,
    (isTagSidebarOpen, isCloud) => (isCloud ? true : isTagSidebarOpen)
);
