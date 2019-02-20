'use strict';

// 'pendingValidation',
// 'pendingCommentDeletion',
// 'flushCache',
// 'dumpDatabase',
// 'seoSitemap',
// 'seoRefreshSlug'


// import * as ActionTypes from '../constants/actionTypes';

// import api from '../middlewares/api';

// // Settings
// const receiveSetting = (json) => ({
//     type: ActionTypes.ADMIN_SETTINGS_CHANGE_SUCCESS,
//     setting: json
// });
// const failSetting = (json) => ({
//     type: ActionTypes.ADMIN_SETTINGS_CHANGE_ERROR,
//     errors: json.errors
// });
// export const updateSettings = (setting) => (dispatch) => {
//     return api
//         .update(`/admin/settings/${setting.id}`, {
//             setting
//         })
//         .then(json => {
//             if (json.errors) {
//                 return dispatch(failSetting(json));
//             } else {
//                 return dispatch(receiveSetting(json));
//             }
//         });
// };
