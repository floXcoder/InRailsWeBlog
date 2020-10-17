'use strict';

const styles = (theme) => ({
    tagChip: {
        margin: theme.spacing(0.5),
        padding: theme.spacing(1, 1),
        fontWeight: 400,
        fontSize: '.9rem',
        cursor: 'pointer',
        color: theme.palette.text.secondary,
        borderColor: theme.palette.text.secondary,
        borderRadius: 16
    },
    tagChipLarge: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        height: 42
    },
    tagChipSmall: {
        margin: theme.spacing(0.5),
        padding: theme.spacing(0.5),
        height: 30
    },
    tagLabel: {
        margin: theme.spacing(0.3),
        padding: theme.spacing(1.5),
        fontSize: '.9rem'
    },
    tagLabelSmall: {
        fontSize: '.8rem'
    },
    parent: {
        margin: theme.spacing(1)
    },
    child: {
        margin: theme.spacing(1)
    }
});

export default styles;
