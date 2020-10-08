'use strict';

const styles = (theme) => ({
    tagChip: {
        margin: theme.spacing(0.5),
        fontWeight: 400,
        fontSize: '.9rem',
        borderRadius: 12,
        cursor: 'pointer',
        color: theme.palette.text.secondary,
        borderColor: theme.palette.text.secondary
    },
    tagChipLarge: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        height: 42,
    },
    tagLabel: {
        margin: theme.spacing(0.3),
        padding: theme.spacing(1.5),
        fontSize: '.9rem'
    },
    parent: {
        margin: theme.spacing(1)
    },
    child: {
        margin: theme.spacing(1)
    }
});

export default styles;
