'use strict';

module.exports = () => {
    return new Promise(resolve => {
        require.ensure([], () => {
            require('../modules/wysiwyg/summernote');
            require('../modules/wysiwyg/lang/summernote-en-US');
            require('../modules/wysiwyg/lang/summernote-fr-FR');

            resolve({});
        }, 'editor');
    });
};
