'use strict';

import {
    AppContainer
} from 'react-hot-loader';

import '../common';

import HomePage from '../../components/home/home';

// ReactDOM.render(
//     <AppContainer>
//         <HomePage />
//     </AppContainer>,
//     document.getElementById('home-component')
// );

const render = Component => {
    ReactDOM.render(
        <AppContainer>
            <Component/>
        </AppContainer>,
        document.getElementById('home-component'),
    )
};

render(HomePage);

// webpack Hot Module Replacement API
if (module.hot) {
    module.hot.accept('../../components/home/home', () => render(HomePage));
}

