'use strict';

const styles = (theme) => ({
    searchSidebar: {
        margin: '.4rem .6rem'
    },
    filterTitle: {
        fontSize: '1.1rem',
        fontWeight: 600,
        lineHeight: '2rem',
        marginTop: '.3rem',
        marginBottom: '.3rem',
        borderBottom: `1px solid ${theme.palette.grey[300]}`,
    },
    filterCategory: {
        marginTop: '1rem',
        marginBottom: '2rem',
        padding: '0 1.2rem'
    },
    filterCategoryTitle: {
        fontSize: '1rem',
        fontWeight: 400,
        marginBottom: '.5rem'
    },
    sliderMark: {
        color: theme.palette.text.primary,
        fontSize: '.8rem'
    }
});

export default styles;
