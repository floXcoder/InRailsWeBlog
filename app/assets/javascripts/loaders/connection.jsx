'use strict';

module.exports = () => {
    return new Promise(resolve => {
        require.ensure([], () => {
            resolve({
                Login: require('../components/users/login'),
                Signup: require('../components/users/signup')
            });
        });
    });
};
