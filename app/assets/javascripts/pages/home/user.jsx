'use strict';

import {
    AppContainer
} from 'react-hot-loader';

import '../common';

import ApplicationLayoutUser from '../../components/layouts/user/application';

ReactDOM.render(
    <AppContainer>
        <ApplicationLayoutUser/>
    </AppContainer>,
    document.getElementById('user-component')
);

// webpack Hot Module Replacement API
if(module.hot) {
    module.hot.accept();
}
