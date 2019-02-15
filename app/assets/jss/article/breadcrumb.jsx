'use strict';

const styles = (theme) => ({
    breadcrumb: {
        color: theme.palette.text.primary,
        fontSize: '1rem',
        listStyleType: 'none',
        margin: 0,
        display: 'flex',
        padding: 0,
        flexWrap: 'wrap',
        alignItems: 'center',
        [theme.breakpoints.down('md')]: {
            paddingLeft: 5
        }
    },
    breadcrumbItem: {
        display: 'inline-block',
        listStyle: 'none',
        margin: '0 .3rem'
    },
    breadcrumbSeparator: {
        marginLeft: 4,
        marginRight: 4,
        listStyle: 'none',
        display: 'inline-block',
        fontSize: 20,
        lineHeight: 0.5
    },
    breadcrumbLink: {
        color: theme.palette.text.secondary
    },
    breadcrumbLast: {
        marginRight: 12,
        color: theme.palette.text.primary
    },
    breadcrumbTag: {
        fontSize: '.9rem',
        borderRadius: 4,
        margin: '0 6px',
        cursor: 'pointer',
        color: theme.palette.text.secondary
    },
    breadcrumbTagLabel: {
        padding: '0 8px'
    }
});

export default styles;
