'use strict';

module.exports = () => {
    return new Promise(resolve => {
        require.ensure([], () => {
            resolve({
                Login: require('../components/user/login'),
                Signup: require('../components/user/signup')
            });
        });
    });
};
