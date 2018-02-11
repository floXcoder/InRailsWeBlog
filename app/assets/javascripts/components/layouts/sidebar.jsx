'use strict';

import Sidebar from '../theme/sidebar';

import TagSidebar from '../tags/sidebar';

const SidebarLayout = ({isDefaultOpened, onOpened}) => (
    <Sidebar isDefaultOpened={isDefaultOpened}
             onOpened={onOpened}>
        <TagSidebar />
    </Sidebar>
);

SidebarLayout.propTypes = {
    onOpened: PropTypes.func.isRequired,
    isDefaultOpened: PropTypes.bool
};

export default SidebarLayout;
