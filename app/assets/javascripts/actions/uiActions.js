'use strict';

import * as ActionTypes from '../constants/actionTypes';

// Topics
export const switchTopicModuleUi = (isTopicOpened) => ({
    type: ActionTypes.UI_OPEN_TOPIC_MODULE,
    isTopicOpened
});
