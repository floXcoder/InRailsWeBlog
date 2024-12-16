// StrictMode render component twice!
// import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import ApplicationLayoutDefault from '@js/components/layouts/default/application';

import Layout from '@js/layout';

Layout.initialize();

// For the website use (no external tracking, no ads), cookies consent are useless
// require('@js/modules/cookieChoices');

const root = createRoot(document.getElementById('react-component'));
root.render(
    <ApplicationLayoutDefault staticContent={document.getElementById('static-component')?.innerHTML}
                              componentId="data-component"/>
);
