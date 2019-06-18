'use strict';

const styles = (theme) => ({
    sorting: {
        userSelect: 'none'
    },
    sortingItems: {
        outline: 'none',
        position: 'relative'
    },
    sortingItem: {
        alignItems: 'center',
        cursor: 'pointer'
    },
    fieldBorder: {
        position: 'relative',
        border: '1px solid #ddd',
        margin: theme.spacing(3, 0),
        padding: theme.spacing(1, 2)
    },
    mandatoryFieldHelper: {
        textAlign: 'center',
        fontStyle: 'italic',
        fontWeight: 500
    },
    fieldDrag: {
        position: 'absolute',
        display: 'block',
        right: 20,
        top: 20,
        cursor: 'row-resize'
    },
    field: {
        margin: '.3rem 0',
        width: '90%'
    },
    fieldPropsButton: {
        color: theme.palette.text.primary,
        textAlign: 'center',
        outline: 'none'
    },
    fieldPropsExpand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest
        })
    },
    fieldPropsExpandOpen: {
        transform: 'rotate(180deg)'
    }
});

export default styles;
