'use strict';

const styles = (theme) => ({
    footer: {
        boxShadow: 'none',
        backgroundColor: theme.palette.background.default,
        margin: '12px auto 32px',
        marginTop: theme.spacing(8),
        borderTop: `1px solid ${theme.palette.grey[300]}`
    },
    footerContainer: {
        paddingTop: '1.6rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '70%',
        textAlign: 'center'
    },
    footerTitle: {
        display: 'block',
        margin: '10px 8px 0',
        fontSize: '2rem'
    },
    footerSubtitle: {
        color: theme.palette.primary.dark
    },
    footerLink: {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        fontSize: '1rem'
    },
    githubLink: {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        fontSize: '.9rem'
    }
});

export default styles;
