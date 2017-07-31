'use strict';

import {LazilyLoadFactory, importLazy} from './hoc-loader';

const DropZoneLoader = ({DropZone, ...props}) => {
    return (
        <DropZone {...props}/>
    )
};

DropZoneLoader.propTypes = {
    DropZone: PropTypes.func
};

export const loadDropZone = () => (
    importLazy(import(/* webpackChunkName: "dropzone" */ '../components/theme/drop-zone'))
);

export default LazilyLoadFactory(DropZoneLoader, {
    DropZone: () => import(/* webpackChunkName: "dropzone" */ '../components/theme/drop-zone')
});
