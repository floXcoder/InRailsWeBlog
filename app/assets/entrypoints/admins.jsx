import {createRoot} from 'react-dom/client';

import AdminLayout from '@js/components/layouts/admin';

const root = createRoot(document.getElementById('admins-component'));
root.render(
    <AdminLayout componentId="admins-component"/>
);
