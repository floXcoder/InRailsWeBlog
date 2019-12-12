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
    metaTags: {},
    pagination: {}
};

export default function commentReducer(state = initState, action) {
    switch (action.type) {
        case ActionTypes.COMMENT_FETCH_INIT:
        case ActionTypes.COMMENT_FETCH_SUCCESS:
        case ActionTypes.COMMENT_FETCH_ERROR:
            return fetchReducer(state, action, (state) => {
                state.comments = action.comments;
            });

        case ActionTypes.COMMENT_CHANGE_INIT:
        case ActionTypes.COMMENT_CHANGE_SUCCESS:
        case ActionTypes.COMMENT_CHANGE_ERROR:
            return mutationReducer(state, action, (state) => {
                if (action.deletedCommentIds) {
                    action.deletedCommentIds.forEach((deletedCommentId) => {
                        const deleteIndex = findItemIndex(state.comments, deletedCommentId);
                        delete state.comments[deleteIndex];
                    });
                } else {
                    const newItem = action.comment;
                    const index = findItemIndex(state.comments, newItem.id);
                    if (index === -1) {
                        if (newItem.parentId) {
                            const parentIndex = findItemIndex(state.comments, newItem.id, 'parentId');
                            state.comments.insert(parentIndex + 1, newItem);
                        } else {
                            state.comments.push(newItem);
                        }
                    } else {
                        state.comments[index] = newItem;
                    }
                }
            });

        default:
            return state;
    }
};
