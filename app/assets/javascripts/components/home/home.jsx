'use strict';

import {
    hot
} from 'react-hot-loader';

import {
    withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import {
    fetchArticles,
    fetchTags
} from '../../actions';

import {
    getHomeArticles,
    getPopularArticles,
    getPopularTags
} from '../../selectors';

import ArticleMiniCardDisplay from '../articles/display/miniCard';
import TagChipDisplay from '../tags/display/chip';

import styles from '../../../jss/home/index';

export default @connect((state) => ({
    homeArticles: getHomeArticles(state),
    popularArticles: getPopularArticles(state),
    popularTags: getPopularTags(state)
}), {
    fetchArticles,
    fetchTags
})

@hot(module)
@withStyles(styles)
class HomeHome extends React.Component {
    static propTypes = {
        // from connect
        homeArticles: PropTypes.array,
        popularArticles: PropTypes.array,
        popularTags: PropTypes.array,
        fetchArticles: PropTypes.func,
        fetchTags: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchArticles({}, {
            home: true,
            summary: true,
            limit: 2
        }, {
            home: true
        });

        this.props.fetchArticles({}, {
            populars: true,
            summary: true,
            limit: 10
        }, {
            populars: true
        });

        this.props.fetchTags({}, {
            limit: 10
        }, {
            populars: true
        });
    }

    render() {
        return (
            <div className={this.props.classes.root}>
                <Grid container={true}
                      spacing={32}
                      direction="row"
                      justify="space-between"
                      alignItems="flex-start">
                    {
                        this.props.homeArticles.map((article) => (
                            <Grid key={article.id}
                                  item={true}
                                  xs={12}
                                  sm={6}>
                                <Paper>
                                    <ArticleMiniCardDisplay article={article}/>
                                </Paper>
                            </Grid>
                        ))
                    }
                </Grid>

                <Grid container={true}
                      spacing={32}
                      direction="row-reverse"
                      justify="space-between"
                      alignItems="flex-start">
                    <Grid item={true}
                          xs={12}
                          sm={6}
                          lg={3}>
                        <div className={this.props.classes.category}>
                            <h2 className={this.props.classes.categoryName}>
                                {I18n.t('js.views.home.tags.title')}
                            </h2>

                            <div>
                                {
                                    this.props.popularTags.map((tag) => (
                                        <TagChipDisplay key={tag.id}
                                                        tag={tag}/>
                                    ))
                                }
                            </div>
                        </div>
                    </Grid>

                    <Grid item={true}
                          xs={12}
                          sm={6}
                          lg={9}>
                        <div className={this.props.classes.category}>
                            <h2 className={this.props.classes.categoryName}>
                                {I18n.t('js.views.home.articles.title')}
                            </h2>

                            <div>
                                {
                                    this.props.popularArticles.map((article) => (
                                        <ArticleMiniCardDisplay key={article.id}
                                                                article={article}/>
                                    ))
                                }
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
