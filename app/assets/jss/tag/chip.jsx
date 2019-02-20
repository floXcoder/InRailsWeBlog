'use strict';

const styles = (theme) => ({
    tagChip: {
        margin: theme.spacing.unit / 2,
        fontWeight: 400,
        fontSize: '.9rem',
        borderRadius: 4,
        cursor: 'pointer',
        // color: theme.palette.text.secondary,
        borderColor: theme.palette.text.secondary
    },
    tagLabel: {
        fontSize: '.9rem',
        margin: theme.spacing.unit / 3
    },
    parent: {
        margin: theme.spacing.unit
    },
    child: {
        margin: theme.spacing.unit
    },
});

export default styles;
