'use strict';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

function ArticleSkeleton({isConnected}) {
    return (
        <Box width="100%"
             my={3}>
            <Grid container={true}>
                {
                    !!isConnected &&
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
                                        <Skeleton variant="circular"
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
                                  variant="rectangular"
                                  width="60%"
                                  height={60}
                                  animation="wave"/>
                    </Box>
                </Grid>

                <Grid item={true}
                      xs={12}>
                    <Box width="100%"
                         my={3}>
                        <Skeleton variant="rectangular"
                                  width="100%"
                                  height={400}
                                  animation="wave"/>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

ArticleSkeleton.propTypes = {
    isConnected: PropTypes.bool
};

ArticleSkeleton.defaultProps = {
    isConnected: false
};

export default React.memo(ArticleSkeleton);
