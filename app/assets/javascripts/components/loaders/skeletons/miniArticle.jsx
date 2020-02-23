'use strict';

import Box from '@material-ui/core/Box';
import Skeleton from '@material-ui/lab/Skeleton';

const MiniArticleSkeleton = () => (
    <Box width="100%"
         marginRight={0.5}
         my={5}>
        <Skeleton variant="rect"
                  width="100%"
                  height={118}
                  animation="wave"/>

        <Box pt={0.5}>
            <Skeleton animation="wave"/>
            <Skeleton width="30%"
                      animation="wave"/>
        </Box>
    </Box>
);

export default React.memo(MiniArticleSkeleton);
