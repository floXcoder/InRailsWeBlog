'use strict';

import {
    withStyles
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Avatar from '@material-ui/core/Avatar';

const styles = (theme) => ({
    cardNumber: {
        width: 360,
        margin: theme.spacing(1)
    },
    iconNumber: {
        margin: 5,
        color: '#fff'
    }
});

export default @withStyles(styles)
class MiniCard extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        number: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]).isRequired,
        icon: PropTypes.element,
        color: PropTypes.string,
        // from styles
        classes: PropTypes.object
    };

    render() {
        return (
            <Card className={this.props.classes.cardNumber}>
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
                                <Avatar className={this.props.classes.iconNumber}
                                        style={{backgroundColor: this.props.color}}
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
