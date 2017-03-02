'use strict';

module.exports = () => {
    return new Promise(resolve => {
        require.ensure([], () => {
            resolve({
                Masonry: require('react-masonry-component')
            });
        }, 'masonry');
    });
};
