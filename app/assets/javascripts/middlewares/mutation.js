'use strict';

import * as ActionTypes from '../constants/actionTypes';

import {
    convertJsonApi
} from './json';

export default function mutationMiddleware({dispatch}) {
    // const initialState = getState();

    return (next) => (action) => {
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

        if (!actionTypes.every((action) => !!action)) {
            console.error(`All actions are not defined: ${actionNames.join(', ')}`);
            throw new Error(`All actions are not defined: ${actionNames.join(', ')}`);
        }

        const [requestType, successType, failureType] = actionTypes;

        if (typeof mutationAPI !== 'function') {
            console.error('mutationAPI must be a function');
            throw new Error('mutationAPI must be a function');
        }

        dispatch({
            // ...payload,
            isProcessing: true,
            type: requestType
        });

        return mutationAPI()
            .then(
                (response) => {
                    if (response?.redirect) {
                        window.location = response.redirect;
                    } else if (response?.errors) {
                        return dispatch({
                            ...payload,
                            errors: response.errors,
                            isProcessing: false,
                            type: failureType
                        });
                    } else {
                        return dispatch({
                            ...payload,
                            ...convertJsonApi(response),
                            isProcessing: false,
                            type: successType
                        });
                    }
                }
            );
    };
}
