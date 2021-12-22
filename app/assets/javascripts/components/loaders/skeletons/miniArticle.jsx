'use strict';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

const MiniArticleSkeleton = () => (
    <Box width="100%"
         marginRight={0.5}
         my={5}>
        <Skeleton variant="rectangular"
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
