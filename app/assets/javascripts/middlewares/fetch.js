'use strict';

import * as ActionTypes from '../constants/actionTypes';

import {
    convertJsonApi
} from './json';

export default function fetchMiddleware({dispatch, getState}) {
    // const initialState = getState();

    return (next) => (action) => {
        const {
            actionType,
            fetchAPI,
            localData,
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

        if (!actionTypes.every((actionType) => !!actionType)) {
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

        if (localData) {
            return {
                fetch: Promise.resolve(dispatch({
                    ...payload,
                    ...convertJsonApi(localData),
                    isFetching: false,
                    type: successType
                })),
                signal: null
            };
        } else {
            const fetcher = fetchAPI();

            const fetch = fetcher.request.then(
                (response) => {
                    if (response?.errors) {
                        return dispatch({
                            ...payload,
                            errors: response.errors || [],
                            isFetching: false,
                            type: failureType
                        });
                    } else if (response?.abort) {
                        return dispatch({
                            ...payload,
                            isFetching: true,
                            type: requestType
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
                signal: fetcher.signal
            };
        }
    };
}
