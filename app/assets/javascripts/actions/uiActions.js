'use strict';

import {
    push
} from 'react-router-redux';

import * as ActionTypes from '../constants/actionTypes';

const uiTopicModule = (isTopicOpened) => ({
    type: ActionTypes.OPEN_UI_TOPIC_MODULE,
    isTopicOpened
});

export const switchUiTopicModule = (isTopicOpened) => (dispatch) => {
    dispatch(uiTopicModule(isTopicOpened))
};
