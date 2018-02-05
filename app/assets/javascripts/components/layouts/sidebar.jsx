'use strict';

import Sidebar from '../theme/sidebar';

import TagSidebar from '../tags/sidebar';

const SidebarLayout = ({params, isDefaultOpened, onOpened}) => (
    <Sidebar isDefaultOpened={isDefaultOpened}
             onOpened={onOpened}>
        <TagSidebar params={params}/>
    </Sidebar>
);

SidebarLayout.propTypes = {
    params: PropTypes.object.isRequired,
    onOpened: PropTypes.func.isRequired,
    isDefaultOpened: PropTypes.bool
};

export default SidebarLayout;
