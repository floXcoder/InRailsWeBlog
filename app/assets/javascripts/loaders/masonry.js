'use strict';

export default function Masonry (callback) {
    import(/* webpackChunkName: "masonry" */ 'react-masonry-component')
        .then((masonry) => {
            if (typeof callback === 'function') {
                callback({Masonry: masonry.default})
            }
        })
        .catch((error) => log.error('Failed to masonry', error));
}
