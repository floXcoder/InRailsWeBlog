'use strict';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';

const ArticleSkeleton = ({isConnected}) => (
    <Box width="100%"
         my={3}>
        <Grid container={true}>
            {
                isConnected &&
                <Grid item={true}
                      xs={12}>
                    <Box marginTop={0}
                         marginBottom={2}>
                        <Skeleton width={260}
                                  animation="wave"/>
                    </Box>
                </Grid>
            }
            <Grid item={true}
                  xs={12}>
                <Grid container={true}
                      spacing={1}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center">
                    <Grid item={true}>
                        <Grid container={true}
                              spacing={1}
                              direction="row"
                              justifyContent="flex-start"
                              alignItems="flex-start">
                            <Grid item={true}>
                                <Box my={1}
                                     marginRight={2}>
                                    <Skeleton variant="circle"
                                              width={40}
                                              height={40}
                                              animation="wave"/>
                                </Box>
                            </Grid>

                            <Grid item={true}>
                                <Skeleton width={80}
                                          animation="wave"/>
                                <Skeleton width={140}
                                          animation="wave"/>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid className="hide-on-small"
                          item={true}>
                        <Skeleton width={140}
                                  animation="wave"/>
                    </Grid>
                </Grid>
            </Grid>

            <Grid item={true}
                  xs={12}>
                <Box width="100%"
                     my={3}
                     marginTop={4}
                     marginBottom={1}>
                    <Skeleton className="center-block"
                              variant="rect"
                              width="60%"
                              height={60}
                              animation="wave"/>
                </Box>
            </Grid>

            <Grid item={true}
                  xs={12}>
                <Box width="100%"
                     my={3}>
                    <Skeleton variant="rect"
                              width="100%"
                              height={400}
                              animation="wave"/>
                </Box>
            </Grid>
        </Grid>
    </Box>
);

ArticleSkeleton.propTypes = {
    isConnected: PropTypes.bool
};

ArticleSkeleton.defaultProps = {
    isConnected: false
};

export default React.memo(ArticleSkeleton);
