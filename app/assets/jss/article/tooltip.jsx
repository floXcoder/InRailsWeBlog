'use strict';

const styles = (theme) => ({
    style: {
        background: theme.palette.background.default,
        color: theme.palette.primary.main,
        padding: theme.spacing.unit * 2,
        boxShadow: theme.shadows[0],
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.primary.main}`
    },
    arrowStyle: {
        color: theme.palette.background.default,
        borderColor: theme.palette.primary.main
    },
    heading: {
        borderBottom: `1px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.main,
        fontWeight: 'bold',
        marginBottom: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        display: 'block'
    },
    description: {
        fontSize: 15,
        lineHeight: '13px',
        marginBottom: 8,
        wordWrap: 'break-word'
    }
});

export default styles;
