'use strict';

const styles = (theme) => ({
    tagChip: {
        margin: theme.spacing(1) / 2,
        fontWeight: 400,
        fontSize: '.9rem',
        borderRadius: 4,
        cursor: 'pointer',
        // color: theme.palette.text.secondary,
        borderColor: theme.palette.text.secondary
    },
    tagLabel: {
        fontSize: '.9rem',
        margin: theme.spacing(1) / 3
    },
    parent: {
        margin: theme.spacing(1)
    },
    child: {
        margin: theme.spacing(1)
    },
});

export default styles;
