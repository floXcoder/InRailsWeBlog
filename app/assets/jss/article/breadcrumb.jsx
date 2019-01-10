'use strict';

const styles = (theme) => ({
    breadcrumb: {
        color: theme.palette.text.primary,
        fontSize: '1.2rem',
        listStyleType: 'none',
        margin: 0,
        [theme.breakpoints.down('md')]: {
            paddingLeft: 5
        }
    },
    breadcrumbItem: {
        display: 'inline-block',
        listStyle: 'none',
        margin: '0 .3rem'
    },
    breadcrumbLink: {
        color: theme.palette.text.secondary,
        textDecoration: 'underline'
    }
});

export default styles;
