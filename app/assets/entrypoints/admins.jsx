import {createRoot} from 'react-dom/client';

import AdminLayout from '@js/components/layouts/admin';

if (process.env.NODE_ENV === 'production') {
    require('@js/production');
} else {
    require('@js/development');
}

const root = createRoot(document.getElementById('admins-component'));
root.render(
    <AdminLayout componentId="admins-component"/>
);
