'use strict';

const styles = () => ({
    categoryTitle: {
        fontSize: '1.4rem',
        fontWeight: 500,
        marginTop: '2rem',
        marginBottom: '.6rem'
    },
    name: {
        width: '100%',
        margin: '1rem 0',
        // borderBottom: '1px solid #000'
    },
    nameLabel: {
        left: '37%',
    },
    nameUnderline: {
        '&:before': {
            left: '25%',
            width: '50%'
        }
    },
    select: {
        width: '90%'
    }
});

export default styles;
