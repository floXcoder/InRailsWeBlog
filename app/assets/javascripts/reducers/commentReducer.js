'use strict';

import {
    Record,
    Map,
    List
} from 'immutable';

import * as ActionTypes from '../constants/actionTypes';

import * as Records from '../constants/records';

import {
    toList,
    fetchReducer,
    mutationReducer,
    findItemIndex
} from './mutators';

const initState = new Record({
    // Required for fetchReducer/mutationReducer
    isFetching: false,
    isProcessing: false,
    errors: new Map(),

    comments: new List(),
    metaTags: new Map(),
    pagination: new Map()
});

export default function commentReducer(state = new initState(), action) {
    switch (action.type) {
        case ActionTypes.COMMENT_FETCH_INIT:
        case ActionTypes.COMMENT_FETCH_SUCCESS:
        case ActionTypes.COMMENT_FETCH_ERROR:
            return fetchReducer(state, action, (payload) => ({
                comments: toList(payload.comments, Records.CommentRecord)
            }));

        case ActionTypes.COMMENT_CHANGE_INIT:
        case ActionTypes.COMMENT_CHANGE_SUCCESS:
        case ActionTypes.COMMENT_CHANGE_ERROR:
            return mutationReducer(state, action, (payload) => {
                let comments = state.comments;
                if (payload.deletedCommentIds) {
                    comments = state.comments.update(items => items.filter((item) => !payload.deletedCommentIds.includes(item.id)));
                } else {
                    const newItem = new Records.CommentRecord(payload.comment);
                    const index = findItemIndex(state.comments, newItem.id);
                    if (index === -1) {
                        if (newItem.parentId) {
                            const parentIndex = findItemIndex(state.comments, newItem.id, 'parentId');
                            comments = state.comments.insert(parentIndex, newItem);
                        } else {
                            comments = state.comments.update(items => items.concat([newItem]));
                        }
                    } else {
                        comments = state.comments.update(index, () => newItem);
                    }
                }

                return {
                    comments
                };
            }, ['comment' , 'deletedCommentIds']);

        default:
            return state;
    }
};
