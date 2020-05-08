'use strict';

import * as ActionTypes from '../constants/actionTypes';

import {
    convertJsonApi
} from './json';

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

    return (next) => (action) => {
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
            return {
                fetch: Promise.resolve(),
                signal: null
            };
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
            console.error(`All actions are not defined: ${actionNames.join(', ')}`);
            throw new Error(`All actions are not defined: ${actionNames.join(', ')}`);
        }

        const [requestType, successType, failureType] = actionTypes;

        if (typeof fetchAPI !== 'function') {
            console.error('callAPI must be a function');
            throw new Error('callAPI must be a function');
        }

        dispatch({
            ...payload,
            isFetching: true,
            type: requestType
        });

        const fetcher = fetchAPI();

        const fetch = fetcher.promise.then(
            (response) => {
                if (response?.errors) {
                    return dispatch({
                        ...payload,
                        errors: response.errors || [],
                        isFetching: false,
                        type: failureType
                    });
                } else {
                    return dispatch({
                        ...payload,
                        ...convertJsonApi(response),
                        isFetching: false,
                        type: successType
                    });
                }
            }
        );

        return {
            fetch,
            signal: fetcher.controller
        }
    };
};
