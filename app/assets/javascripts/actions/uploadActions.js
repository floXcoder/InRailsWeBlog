
import {
    maxWidthUpload,
    maxHeightUpload
} from '@js/components/modules/constants';

import api from '@js/middlewares/api';

const compress = (originalFile, callback) => {
    let maxWidth = maxWidthUpload;
    let maxHeight = maxHeightUpload;
    const fileName = originalFile.name;
    const reader = new FileReader();
    reader.readAsDataURL(originalFile);
    reader.onload = (event) => {
        const image = new Image();
        image.src = event.target.result;
        image.onload = () => {
            if (image.width < maxWidth && image.height < maxHeight) {
                callback(originalFile);
                return;
            }

            if (image.height > image.width) {
                maxWidth = image.width * (maxHeight / image.height);
            } else {
                maxHeight = image.height * (maxWidth / image.width);
            }

            const elem = document.createElement('canvas');
            elem.width = maxWidth;
            elem.height = maxHeight;
            const ctx = elem.getContext('2d');
            // img.width and img.height will contain the original dimensions
            ctx.drawImage(image, 0, 0, maxWidth, maxHeight);

            ctx.canvas.toBlob((blob) => {
                const compressedFile = new File([blob], fileName, {
                    type: 'image/jpeg',
                    lastModified: Date.now()
                });

                callback(compressedFile);
            }, 'image/jpeg', 1);
        };
    };
    reader.onerror = (error) => console.error(error);
};

export const uploadImages = (images, params, doneCallback) => {
    const uploads = [];

    Object.entries(images).forEach(([, imageValue]) => {
        compress(imageValue, (compressedFile) => {
            const formData = new FormData();

            formData.append('upload[file]', compressedFile);

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

// export const updateImage = (imageId, imageData) => {
//     return api.update(`/api/v1/uploader/${imageId}`, imageData);
// };

export const deleteImage = (imageId, options = {}) => {
    return api.delete(`/api/v1/uploader/${imageId}`, options);
};
