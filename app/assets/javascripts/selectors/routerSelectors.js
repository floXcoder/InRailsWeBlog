'use strict';

import {
    createSelector
} from 'reselect';

export const getRouteProperties = createSelector(
    (state) => state.routerState.currentRoute,
    (currentRoute) => currentRoute.toJS()
);

export const getRouteParams = createSelector(
    (state) => state.routerState.params,
    (params) => params.toJS()
);

export const getRouteLocation = createSelector(
    (state) => state.routerState.location,
    (location) => location.toJS()
);
