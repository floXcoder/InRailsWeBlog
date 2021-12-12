'use strict';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';


export default class MiniCard extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string.isRequired,
        number: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]).isRequired,
        icon: PropTypes.element,
        color: PropTypes.string
    };

    render() {
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
                                {this.props.number}
                            </Typography>

                            <Typography variant="body2"
                                        color="textSecondary"
                                        component="p">
                                {this.props.title}
                            </Typography>
                        </Grid>

                        {
                            this.props.icon &&
                            <Grid item={true}
                                  xs={3}>
                                <Avatar style={{
                                    margin: 5,
                                    color: '#fff',
                                    backgroundColor: this.props.color
                                }}
                                        variant="rounded">
                                    {this.props.icon}
                                </Avatar>
                            </Grid>
                        }
                    </Grid>
                </CardContent>
            </Card>
        );
    }
}
