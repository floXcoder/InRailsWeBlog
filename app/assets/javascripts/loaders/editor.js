'use strict';

export default function Editor(callback) {
    import(/* webpackChunkName: "editor" */ '../modules/summernote')
        .then((editor) => {
            if (typeof callback === 'function') {
                callback({Editor: editor.default})
            }
        })
        .catch(error => log.error('Failed to load editor', error));
}
