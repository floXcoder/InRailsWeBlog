'use strict';

import {
    AppContainer
} from 'react-hot-loader';

import '../common';

import ApplicationLayoutHome from '../../components/layouts/home/application';

ReactDOM.render(
    <AppContainer>
        <ApplicationLayoutHome/>
    </AppContainer>,
    document.getElementById('home-component')
);

// webpack Hot Module Replacement API
if(module.hot) {
    module.hot.accept();
}
