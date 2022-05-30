'use strict';

import * as ActionTypes from '../constants/actionTypes';

import {
    fetchReducer,
    mutationReducer,
    findItemIndex
} from './mutators';

const initState = {
    // Required for fetchReducer/mutationReducer
    isFetching: false,
    isProcessing: false,
    errors: {},

    comments: [],
    pagination: {}
};

export default function commentReducer(state = initState, action) {
    switch (action.type) {
        case ActionTypes.COMMENT_FETCH_INIT:
        case ActionTypes.COMMENT_FETCH_SUCCESS:
        case ActionTypes.COMMENT_FETCH_ERROR:
            return fetchReducer(state, action, (newState) => {
                newState.comments = action.comments;
            });

        case ActionTypes.COMMENT_CHANGE_INIT:
        case ActionTypes.COMMENT_CHANGE_SUCCESS:
        case ActionTypes.COMMENT_CHANGE_ERROR:
            return mutationReducer(state, action, (newState) => {
                if (action.deletedCommentIds) {
                    action.deletedCommentIds.forEach((deletedCommentId) => {
                        const deleteIndex = findItemIndex(newState.comments, deletedCommentId);
                        delete newState.comments[deleteIndex];
                    });
                } else {
                    const newItem = action.comment;
                    const index = findItemIndex(newState.comments, newItem.id);
                    if (index === -1) {
                        if (newItem.parentId) {
                            const parentIndex = findItemIndex(newState.comments, newItem.id, 'parentId');
                            newState.comments.insert(parentIndex + 1, newItem);
                        } else {
                            newState.comments.push(newItem);
                        }
                    } else {
                        newState.comments[index] = newItem;
                    }
                }
            });

        default:
            return state;
    }
}
