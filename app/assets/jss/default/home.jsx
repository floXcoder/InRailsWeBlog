'use strict';

import {
    lighten
} from '@material-ui/core/styles/colorManipulator';

import {
    mainWidth,
} from '../theme';

const styles = (theme) => ({
    home: {
        position: 'relative',
        overflow: 'visible'
    },
    homeDivider: {
        margin: 0,
        backgroundColor: lighten(theme.palette.primary.main, 0.9)
    },
    homeContent: {
        width: 'auto',
        paddingLeft: 8,
        paddingRight: 8,
        [theme.breakpoints.up(mainWidth + theme.spacing(6))]: {
            width: mainWidth,
            padding: 0,
            marginLeft: 'auto',
            marginRight: 'auto'
        }
    },

    banner: {
        minHeight: '60vh',
        padding: '1rem',
        paddingBottom: '3rem',
        position: 'relative'
    },
    bannerTitle: {
        textAlign: 'center',
        [theme.breakpoints.down('md')]: {
            position: 'relative',
            zIndex: 2
        }
    },
    bannerMotto: {
        marginTop: 0,
        marginBottom: theme.spacing(1),
        paddingTop: '5vh',
        color: theme.palette.primary.dark
    },
    bannerMottoSub: {
        marginTop: theme.spacing(1),
        color: theme.palette.secondary.main
    },
    bannerButtons: {
        marginTop: '2rem',
        marginRight: '3rem',
        textAlign: 'right',
        [theme.breakpoints.down('sm')]: {
            marginTop: '1rem',
            marginRight: 'auto',
            textAlign: 'center'
        },
        [theme.breakpoints.down('md')]: {
            marginTop: '4rem'
        }
    },
    bannerButton: {
        margin: '1rem'
    },
    bannerBackground: {
        marginLeft: '4rem',
        [theme.breakpoints.down('md')]: {
            position: 'absolute',
            top: '2.5rem',
            margin: '1rem auto',
            zIndex: 1,
            opacity: 0.3
        }
    },
    bannerBackgroundImg: {
        width: 300,
        height: 300
    },

    search: {
        padding: '3rem 0 4rem',
        background: lighten(theme.palette.primary.main, 0.92)
    },
    searchTitle: {
        textAlign: 'center',
        marginBottom: '2.2rem',
        color: theme.palette.primary.dark,
        [theme.breakpoints.down('md')]: {
            fontSize: '2.5rem'
        }
    },
    searchLoader: {
        textAlign: 'center'
    },
    searchField: {
        position: 'relative',
        backgroundColor: theme.palette.grey[100],
        margin: theme.spacing(4),
        width: '100%',
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: 24,
        transition: 'border 1s ease-out',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto'
        },
        [theme.breakpoints.down('md')]: {
            width: 'auto',
            margin: theme.spacing(2)
        }
    },
    searchIcon: {
        width: theme.spacing(9),
        color: '#000',
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },
    inputLabel: {
        textIndent: '-9999px',
        height: 0
    },
    inputRoot: {
        color: '#000',
        width: '100%',
        paddingLeft: theme.spacing(8),
        [theme.breakpoints.down('md')]: {
            paddingLeft: theme.spacing(2)
        }
    },
    inputInput: {
        paddingTop: theme.spacing(1),
        paddingRight: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        width: '100%'
    },
    searchButton: {
        marginTop: '2.6rem',
        textAlign: 'center',
        [theme.breakpoints.down('md')]: {
            marginTop: '3rem'
        }
    },
    categoryName: {
        marginTop: 8,
        fontSize: '1.6rem',
        fontWeight: 500,
        color: theme.palette.text.primary,
        [theme.breakpoints.down('md')]: {
            marginTop: 0,
            marginBottom: 6,
            textAlign: 'center'
        }
    },
    categoryDivider: {
        margin: theme.spacing(5),
        background: `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 80%)`
    },
    articleMainItem: {
        minHeight: 50,
        width: '100%',
        border: `1px solid ${theme.palette.primary.light}`,
        borderRadius: 12,
        margin: theme.spacing(1.5),
        padding: '12px !important',
        backgroundColor: '#f7f7f7',
        boxShadow: '0 2px 10px 0 rgba(23,70,161,.11)',
        [theme.breakpoints.down('md')]: {
            margin: theme.spacing(2.5, 2),
        }
    },
    articleTitleResult: {
        display: 'block',
        color: theme.palette.text.primary,
        fontSize: '1.6rem',
        fontWeight: 500,
        lineHeight: '2.6rem'
    },
    articleHighlightResult: {
        display: 'block',
        color: theme.palette.text.secondary,
        fontSize: '1rem',
        lineHeight: '2.8rem'
    },
    articleTag: {
        margin: theme.spacing(1.5, 2, 0, 0),
        padding: theme.spacing(1),
        color: theme.palette.text.secondary,
        fontSize: '.9rem',
        borderColor: theme.palette.grey[600],
        borderRadius: 16
    },
    tag: {
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        borderRadius: 16,
        backgroundColor: '#f7f7f7',
        borderColor: theme.palette.grey[600],
        display: 'flex'
    },
    tagLink: {
        color: theme.palette.text.secondary,
        fontSize: '1rem'
    },
    tagNone: {
        fontStyle: 'italic',
        fontSize: '1rem'
    },

    populars: {
        padding: '3rem 0'
    },
    popularsTitle: {
        textAlign: 'center',
        color: theme.palette.primary.dark,
        fontWeight: 700,
        [theme.breakpoints.down('md')]: {
            fontSize: '2.5rem'
        }
    },
    popularsSubtitle: {
        lineHeight: '2.4rem',
        color: theme.palette.text.primary,
        [theme.breakpoints.down('md')]: {
            textAlign: 'center'
        }
    },
    popularsDivider: {
        margin: '2.5rem auto',
        width: 220,
        background: `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 80%)`
    },
    popularsItem: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4)
    },
    popularsTag: {
        display: 'inline'
    },
    popularsCategory: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(4),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1)
    },
    popularsButton: {
        marginTop: '2.8rem',
        textAlign: 'center'
    },
    popularsHomeButtonContainer: {
        marginTop: '.4rem',
        marginBottom: '3.2rem',
        textAlign: 'center'
    },
    popularsHomeButton: {
        color: '#fff'
    },

    functionalities: {
        marginBottom: -theme.spacing(1),
        padding: theme.spacing(3, 2),
        background: lighten(theme.palette.primary.main, 0.9)
    },
    functionalitiesTitle: {
        textAlign: 'center',
        marginBottom: '1.4rem',
        color: theme.palette.primary.dark,
        [theme.breakpoints.down('md')]: {
            fontSize: '2.5rem'
        }
    },
    functionalitiesItem: {
        marginTop: '.5rem',
        marginBottom: '.5rem',
        [theme.breakpoints.down('md')]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2)
        }
    },
    functionalitiesSubtitle: {
        fontSize: '1.8rem',
        marginBottom: '1.1rem'
    },
    functionalitiesDetails: {
        width: '80%',
        [theme.breakpoints.down('md')]: {
            width: 'auto'
        }
    },
    functionalitiesIconItem: {
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },
    functionalitiesIconContainer: {
        height: '4.6rem',
        width: '4.6rem',
        backgroundColor: theme.palette.secondary.main
    },
    functionalitiesIcon: {
        fontSize: '3rem'
    },
    functionalitiesButton: {
        marginTop: '2.2rem',
        marginBottom: '2.2rem',
        textAlign: 'center'
    }
});

export default styles;
