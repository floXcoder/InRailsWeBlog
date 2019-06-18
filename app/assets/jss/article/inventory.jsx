'use strict';

const styles = (theme) => ({
    inventoryList: {
        position: 'relative',
        margin: '.4rem .3rem 1.2rem',
        overflow: 'visible',
        border: 0,
        boxShadow: theme.shadows[0]
    },
    inventoryListTitle: {
        color: theme.palette.text.secondary,
        fontSize: '0.825rem',
        fontWeight: 400
    },
    inventoryListContent: {
        color: theme.palette.text.primary,
        fontSize: '1rem',
        fontWeight: 400
    },
    inventoryListString: {
        fontSize: '1rem'
    },
    inventoryListText: {
        height: 200,
        fontWeight: 'lighter',
        content: "''",
        position: 'relative',
        textAlign: 'left',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        padding: '.5em',
        '&:before': {
            content: "''",
            fontWeight: 'lighter',
            width: '100%',
            height: 80,
            position: 'absolute',
            left: 0,
            top: 120,
            background: 'transparent linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, .9), #fff)'
        }
    }
});

export default styles;
