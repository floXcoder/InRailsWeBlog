'use strict';

import api from '../middlewares/api';

export const uploadImages = (images, params) => {
    const uploads = [];

    Object.entries(images).forEach(([key, value]) => {
        let formData = new FormData();

        formData.append(`upload[file]`, value);

        Object.entries(params).forEach(([key, value]) => {
            formData.append(`upload[${key}]`, value);
        });

        uploads.push(api.post('/api/v1/uploads', formData, true));
    });

    return uploads;
};
