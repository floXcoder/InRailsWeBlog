'use strict';

import {
    maxWidthUpload,
    maxHeightUpload
} from '../components/modules/constants';

import api from '../middlewares/api';

const compress = (originalFile, callback) => {
    const width = maxWidthUpload;
    const height = maxHeightUpload;
    const fileName = originalFile.name;
    const reader = new FileReader();
    reader.readAsDataURL(originalFile);
    reader.onload = (event) => {
        const image = new Image();
        image.src = event.target.result;
        image.onload = () => {
            if(image.width < width && image.height < height) {
                callback(originalFile);
                return;
            }

            const elem = document.createElement('canvas');
            elem.width = width;
            elem.height = height;
            const ctx = elem.getContext('2d');
            // img.width and img.height will contain the original dimensions
            ctx.drawImage(image, 0, 0, width, height);
            ctx.canvas.toBlob((blob) => {
                const compressedFile = new File([blob], fileName, {
                    type: 'image/jpeg',
                    lastModified: Date.now()
                });

                callback(compressedFile)
            }, 'image/jpeg', 1);
        };
    };
    reader.onerror = (error) => console.error(error);
}

export const uploadImages = (images, params, doneCallback) => {
    let uploads = [];

    Object.entries(images).forEach(([, value]) => {
        compress(value, (compressedFile) => {
            let formData = new FormData();

            formData.append(`upload[file]`, compressedFile);

            Object.entries(params).forEach(([key, value]) => {
                formData.append(`upload[${key}]`, value);
            });

            uploads.push(api.post('/api/v1/uploader', formData, true));

            if (images.length === uploads.length) {
                doneCallback(uploads);
            }
        });
    });
};

export const deleteImage = (imageId, options = {}) => {
    return api.delete(`/api/v1/uploader/${imageId}`, options);
};
