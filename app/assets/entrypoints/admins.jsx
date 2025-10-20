import {createRoot} from 'react-dom/client';

import AdminLayout from '@js/components/layouts/admin';

if (process.env.NODE_ENV === 'production') {
    require('@js/production');
} else {
    require('@js/development');
}

const adminComponentElement = document.getElementById('admins-component');
if (adminComponentElement) {
    const root = createRoot(adminComponentElement);
    root.render(
        <AdminLayout componentId="admins-component"/>
    );
}
