'use strict';

import {
    hot
} from 'react-hot-loader/root';

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
    homeHomeLimit,
    homePopularsLimit,
} from '../modules/constants';

import Loader from '../theme/loader';

import ArticleMiniCardDisplay from '../articles/display/items/miniCard';
import TagChipDisplay from '../tags/display/chip';

import styles from '../../../jss/home/index';

export default @connect((state) => ({
    homeArticles: state.articleState.homeArticles,
    popularArticles: state.articleState.popularArticles,
    popularTags: state.tagState.popularTags
}), {
    fetchArticles,
    fetchTags
})
@hot
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
            limit: homeHomeLimit
        }, {
            home: true
        });

        this.props.fetchArticles({}, {
            populars: true,
            summary: true,
            limit: homePopularsLimit
        }, {
            populars: true
        });

        this.props.fetchTags({}, {
            limit: homePopularsLimit
        }, {
            populars: true
        });
    }

    render() {
        return (
            <div className={this.props.classes.root}>
                <Grid container={true}
                      spacing={4}
                      direction="row"
                      justify="space-between"
                      alignItems="flex-start">
                    {
                        this.props.homeArticles?.length > 0
                            ?
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
                            :
                            <div className={this.props.classes.loader}>
                                <Loader size="big"/>
                            </div>
                    }
                </Grid>

                <Grid container={true}
                      spacing={4}
                      direction="row-reverse"
                      justify="space-between"
                      alignItems="flex-start">
                    <Grid item={true}
                          xs={12}
                          sm={4}
                          md={4}
                          lg={3}>
                        <div className={this.props.classes.category}>
                            <h2 className={this.props.classes.categoryName}>
                                {I18n.t('js.views.home.tags.title')}
                            </h2>

                            <div>
                                {
                                    this.props.popularTags?.length > 0
                                        ?
                                        this.props.popularTags.map((tag) => (
                                            <TagChipDisplay key={tag.id}
                                                            tag={tag}/>
                                        ))
                                        :
                                        <div className="center">
                                            <Loader size="big"/>
                                        </div>
                                }
                            </div>
                        </div>
                    </Grid>

                    <Grid item={true}
                          xs={12}
                          sm={8}
                          md={8}
                          lg={9}>
                        <div className={this.props.classes.category}>
                            <h2 className={this.props.classes.categoryName}>
                                {I18n.t('js.views.home.articles.title')}
                            </h2>

                            <div>
                                {
                                    this.props.popularArticles?.length > 0
                                        ?
                                        this.props.popularArticles.map((article) => (
                                            <ArticleMiniCardDisplay key={article.id}
                                                                    article={article}/>
                                        ))
                                        :
                                        <div className="center">
                                            <Loader size="big"/>
                                        </div>
                                }
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
        );
    }
}
