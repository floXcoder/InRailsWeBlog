'use strict';

import {
    articleAppendixWidth,
    mainWidth
} from '../theme';

const styles = (theme) => ({
    userHome: {
        position: 'relative',
        margin: '1rem auto 4rem',
        overflow: 'visible',
        maxWidth: mainWidth
    },
    userHomeTopics: {
        margin: '1rem auto 4rem',
        maxWidth: articleAppendixWidth
    },
    userHomeArticles: {
        margin: '1rem auto 4rem',
        maxWidth: mainWidth
    },
    userHomeCard: {
        position: 'relative',
        margin: '3rem .3rem 3rem',
        overflow: 'visible',
        [theme.breakpoints.down('md')]: {
            marginTop: '2rem'
        }
    },
    header: {
        paddingTop: 8,
        paddingBottom: 8
    },
    subheader: {
        fontSize: '.9rem'
    },
    sortIcon: {
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },
    gridTheme: {
        position: 'relative'
    },
    topic: {
        position: 'relative',
        height: '6rem',
        backgroundColor: theme.palette.primary.main,
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        [theme.breakpoints.down('md')]: {
            height: '5rem'
        },
        [theme.breakpoints.up('sm')]: {
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3)
        }
    },
    topicTitle: {
        marginTop: '1rem',
        textAlign: 'center',
        color: '#fff',
        fontSize: '1.2rem'
    },
    topicLanguages: {
        marginTop: '.8rem',
        marginRight: theme.spacing(-1),
        textAlign: 'left',
        float: 'left',
        color: '#fff',
        fontSize: '.9rem',
        fontStyle: 'italic',
        [theme.breakpoints.down('md')]: {
            marginTop: 0
        }
    },
    topicMode: {
        marginTop: '.8rem',
        marginRight: theme.spacing(-1),
        textAlign: 'right',
        color: '#fff',
        fontSize: '.9rem',
        fontStyle: 'italic',
        [theme.breakpoints.down('md')]: {
            marginTop: 0
        }
    },
    topicNew: {
        height: '6rem',
        backgroundColor: theme.palette.grey[200],
        [theme.breakpoints.down('md')]: {
            height: '5rem'
        }
    },
    topicNewTitle: {
        fontSize: '1.05rem',
        paddingTop: '15%',
        textAlign: 'center',
        fontStyle: 'italic',
        [theme.breakpoints.down('md')]: {
            paddingTop: '9%'
        }
    },
    topicLink: {
        position: 'absolute',
        top: -2,
        right: -4,
        height: '44px !important',
        width: '44px !important',
        borderRadius: '25px !important',
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
        [theme.breakpoints.down('md')]: {
            display: 'none'
        }
    },
    userHomeDivider: {
        margin: '2.5rem auto',
        width: 220,
        background: `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 80%)`
    }
});

export default styles;
