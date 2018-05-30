'use strict';

import * as ActionTypes from '../constants/actionTypes';

// Example of CRUD mutation:
// export function loadPosts(userId) {
//     return {
//         // Types of actions to emit before and after
//         types: ['LOAD_POSTS_REQUEST', 'LOAD_POSTS_SUCCESS', 'LOAD_POSTS_FAILURE'],
//         // Check the cache (optional):
//         shouldCallAPI: (state) => !state.posts[userId],
//         // Perform the fetching:
//         callAPI: () => fetch(`http://myapi.com/users/${userId}/posts`),
//         // Arguments to inject in begin/end actions
//         payload: { userId }
//     }
// }

export default function mutationMiddleware({dispatch}) {
    // const initialState = getState();

    return (next) => action => {
        const {
            actionType,
            mutationAPI,
            payload = {}
        } = action;

        if (!actionType || !mutationAPI) {
            // Normal action: pass it on
            return next(action);
        }

        const actionNames = [
            `${actionType}_CHANGE_INIT`,
            `${actionType}_CHANGE_SUCCESS`,
            `${actionType}_CHANGE_ERROR`
        ];
        const actionTypes = [
            ActionTypes[`${actionType}_CHANGE_INIT`],
            ActionTypes[`${actionType}_CHANGE_SUCCESS`],
            ActionTypes[`${actionType}_CHANGE_ERROR`]
        ];

        if (!actionTypes.every(action => !!action)) {
            log.error(`All actions are not defined: ${actionNames.join(', ')}`);
            throw new Error(`All actions are not defined: ${actionNames.join(', ')}`);
        }

        const [requestType, successType, failureType] = actionTypes;

        if (typeof mutationAPI !== 'function') {
            log.error('mutationAPI must be a function');
            throw new Error('mutationAPI must be a function');
        }

        dispatch({
            // ...payload,
            isProcessing: true,
            type: requestType
        });

        return mutationAPI().then(
            (response) => {
                if (response && response.errors) {
                    return dispatch({
                        ...payload,
                        errors: response.errors,
                        isProcessing: false,
                        type: failureType
                    });
                } else if (response && response.redirect) {
                    window.location = response.redirect;
                } else {
                    return dispatch({
                        ...payload,
                        ...response,
                        isProcessing: false,
                        type: successType
                    });
                }
            }
        )
    };
};
