'use strict';

const styles = (theme) => ({
    modal: {
        top: '45%',
        left: '50%',
        transform: 'translate(-50%, -45%)',
        position: 'absolute',
        width: '35vw',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(4),
        [theme.breakpoints.down('md')]: {
            width: '90vw'
        }
    },
    topicField: {
        margin: theme.spacing(1.5, .1),
        width: '100%'
    },
    topicModeHelper: {
        margin: theme.spacing(.5, .1, 2),
        border: '1px solid #ddd',
        padding: theme.spacing(1, 2)
    }
});

export default styles;
