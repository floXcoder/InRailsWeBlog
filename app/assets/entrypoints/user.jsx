// StrictMode render component twice!
// import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import Layout from '@js/layout';

if (process.env.NODE_ENV === 'production') {
    require('@js/production');
} else {
    require('@js/development');
}

Layout.initialize();

import ApplicationLayoutUser from '@js/components/layouts/user/application';

const root = createRoot(document.getElementById('react-component'));
root.render(
    <ApplicationLayoutUser staticContent={document.getElementById('static-component')?.innerHTML}
                           componentId="data-component"/>
);