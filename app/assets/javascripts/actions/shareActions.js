
import * as ActionTypes from '@js/constants/actionTypes';

import api from '@js/middlewares/api';

// Topics
export const shareTopic = (topicId, userLogin) => ({
    actionType: ActionTypes.TOPIC,
    mutationAPI: () => api.post('/api/v1/shares/topic', {
        share: {
            topicId,
            login: userLogin
        }
    })
});

// Articles
export const shareArticle = (articleId) => ({
    actionType: ActionTypes.ARTICLE,
    mutationAPI: () => api.post('/api/v1/shares/article', {
        share: {
            articleId
        }
    })
});
