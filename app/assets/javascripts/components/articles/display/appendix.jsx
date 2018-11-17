'use strict';

import Sticky from 'react-stickynode';

import {
    withStyles
} from '@material-ui/core/styles';
import withWidth from '@material-ui/core/withWidth';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Grow from '@material-ui/core/Grow';

import MenuIcon from '@material-ui/icons/Menu';

import {
    updateUserSettings
} from '../../../actions';

import {
    getArticles,
    getSortedTopicTags
} from '../../../selectors';

import ArticleOrderDisplay from './order';

import styles from '../../../../jss/article/appendix';

export default @connect((state) => ({
    currentUserId: state.userState.currentId,
    currentUserSlug: state.userState.currentSlug,
    currentUserTopicId: state.topicState.currentUserTopicId,
    currentUserTopicSlug: state.topicState.currentUserTopicSlug,
    articleOrderMode: state.uiState.articleOrderMode,
    articles: getArticles(state),
    tags: getSortedTopicTags(state)
}), {
    updateUserSettings
})

@withStyles(styles)
@withWidth()
class ArticleAppendixDisplay extends React.Component {
    static propTypes = {
        currentArticles: PropTypes.array.isRequired,
        currentTags: PropTypes.array.isRequired,
        onMinimized: PropTypes.func.isRequired,
        // from connect
        currentUserId: PropTypes.number,
        currentUserSlug: PropTypes.string,
        currentUserTopicId: PropTypes.string,
        currentUserTopicSlug: PropTypes.string,
        articleOrderMode: PropTypes.string,
        articles: PropTypes.array,
        tags: PropTypes.array,
        updateUserSettings: PropTypes.func,
        // from styles
        classes: PropTypes.object,
        // from withWidth
        width: PropTypes.string
    };

    static defaultProps = {
        currentArticles: [],
        currentTags: []
    };

    constructor(props) {
        super(props);
    }

    state = {
        isOpen: false,
    };

    _handleClick = () => {
        this.setState(state => ({
            isOpen: !state.isOpen,
        }));
    };

    _handleOrderChange = (order) => {
        this.props.updateUserSettings(this.props.currentUserId, {
            articleOrder: order
        }, {
            topicId: this.props.currentUserTopicId
        });
    };

    render() {
        return (
            <Sticky enabled={true}
                    top="header">
                <Button className={this.props.classes.fabButton}
                        variant="fab"
                        color="default"
                        mini={true}
                        aria-label="Menu"
                        onClick={this._handleClick}>
                    <MenuIcon/>
                </Button>

                <Grow in={this.state.isOpen}
                      timeout={350}>
                    <Card component="section"
                          className={this.props.classes.appendix}>
                        <CardHeader classes={{
                            root: this.props.classes.header,
                            title: this.props.classes.title
                        }}
                                    title={I18n.t('js.article.toc.title')}
                        />

                        <CardActions disableActionSpacing={true}>
                            <ArticleOrderDisplay classes={this.props.classes}
                                                 currentUserId={this.props.currentUserId}
                                                 currentUserSlug={this.props.currentUserSlug}
                                                 currentUserTopicSlug={this.props.currentUserTopicSlug}
                                                 articleOrderMode={this.props.articleOrderMode}
                                                 onMinimized={this.props.onMinimized}
                                                 onOrderChange={this._handleOrderChange}/>
                        </CardActions>

                        <CardContent classes={{
                            root: this.props.classes.content
                        }}>
                            {
                                this.props.articles.map((article) => (
                                    <div key={article.id}>
                                        <a href={'#' + article.id}
                                           className={classNames(this.props.classes.articleLink, {
                                               [this.props.classes.currentLink]: this.props.currentArticles.includes(article.id)
                                           })}
                                        >
                                            {article.title}
                                        </a>
                                    </div>
                                ))
                            }
                        </CardContent>
                    </Card>
                </Grow>
            </Sticky>
        );
    }
}
