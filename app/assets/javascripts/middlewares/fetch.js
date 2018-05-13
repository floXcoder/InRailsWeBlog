'use strict';

import * as ActionTypes from '../constants/actionTypes';

// Example:
// export function loadPosts(userId) {
//     return {
//         // Types of actions to emit before and after
//         actionType: ActionTypes.RIDE,
//         // Check the cache (optional):
//         shouldCallAPI: (state) => !state.posts[userId],
//         // Perform the fetching:
//         fetchAPI: () => fetch(`http://myapi.com/users/${userId}/posts`),
//         // Arguments to inject in begin/end actions
//         payload: { userId }
//     }
// }

export default function fetchMiddleware({dispatch, getState}) {
    // const initialState = getState();

    return (next) => action => {
        const {
            actionType,
            fetchAPI,
            shouldCallAPI = () => true,
            payload = {}
        } = action;

        if (!actionType || !fetchAPI) {
            // Normal action: pass it on
            return next(action);
        }

        if (!shouldCallAPI(getState())) {
            return Promise.resolve();
        }

        const actionNames = [
            `${actionType}_FETCH_INIT`,
            `${actionType}_FETCH_SUCCESS`,
            `${actionType}_FETCH_ERROR`
        ];
        const actionTypes = [
            ActionTypes[`${actionType}_FETCH_INIT`],
            ActionTypes[`${actionType}_FETCH_SUCCESS`],
            ActionTypes[`${actionType}_FETCH_ERROR`],
        ];

        if (!actionTypes.every(action => !!action)) {
            throw new Error(`All actions are not defined : ${actionNames.join(', ')}`);
        }

        const [requestType, successType, failureType] = actionTypes;

        if (typeof fetchAPI !== 'function') {
            throw new Error(`callAPI must be a function`);
        }

        dispatch({
            // ...payload,
            isFetching: true,
            type: requestType
        });

        return fetchAPI().then(
            (response) => {
                if (response && response.errors) {
                    return dispatch({
                        ...payload,
                        errors: response.errors || [],
                        isFetching: false,
                        type: failureType
                    });
                } else {
                    return dispatch({
                        ...payload,
                        ...response,
                        isFetching: false,
                        type: successType
                    });
                }
            }
        )
    };
};
