'use strict';

module.exports = () => {
    return new Promise(resolve => {
        require.ensure([], () => {
            resolve({
                Login: require('../components/users/login').default,
                Signup: require('../components/users/signup').default
            });
        }, 'user-connection');
    });
};
