'use strict';

import Sidebar from '../theme/sidebar';

import TagSidebar from '../tags/sidebar';

const SidebarLayout = ({params, onOpened}) => (
    <Sidebar onOpened={onOpened}>
        <TagSidebar params={params}/>
    </Sidebar>
);

SidebarLayout.propTypes = {
    params: PropTypes.object.isRequired,
    onOpened: PropTypes.func.isRequired
};

export default SidebarLayout;
