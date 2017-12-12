'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./configureStore.admin.prod');
} else {
  module.exports = require('./configureStore.admin.dev');
}




