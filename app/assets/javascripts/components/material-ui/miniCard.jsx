'use strict';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';


const MiniCard = function ({title, number, icon, color}) {
    return (
        <Card style={{
            width: 360,
            margin: 8
        }}>
            <CardContent>
                <Grid container={true}
                      spacing={2}>
                    <Grid item={true}
                          xs={true}>
                        <Typography gutterBottom={true}
                                    variant="h5"
                                    component="h2">
                            {number}
                        </Typography>

                        <Typography variant="body2"
                                    color="textSecondary"
                                    component="p">
                            {title}
                        </Typography>
                    </Grid>

                    {
                        !!icon &&
                        <Grid item={true}
                              xs={3}>
                            <Avatar style={{
                                margin: 5,
                                color: '#fff',
                                backgroundColor: color
                            }}
                                    variant="rounded">
                                {icon}
                            </Avatar>
                        </Grid>
                    }
                </Grid>
            </CardContent>
        </Card>
    );
};

MiniCard.propTypes = {
    title: PropTypes.string.isRequired,
    number: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    icon: PropTypes.element,
    color: PropTypes.string
};

export default React.memo(MiniCard);
