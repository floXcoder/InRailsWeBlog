'use strict';

import LazyLoaderFactory, {
    importPrefetch
} from './lazyLoader';

const DropZoneLoader = ({DropZone, ...props}) => {
    return (
        <DropZone {...props}/>
    )
};

DropZoneLoader.propTypes = {
    DropZone: PropTypes.func
};

export const loadDropZone = () => (
    importPrefetch(import(/* webpackChunkName: "drop-zone" */ '../theme/dropZone'))
);

const DropZone = (props) => (
    <LazyLoaderFactory module={import(/* webpackChunkName: "drop-zone" */ '../theme/dropZone')}
                       props={props}/>
);

export default DropZone;
