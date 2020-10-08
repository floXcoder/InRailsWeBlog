'use strict';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import {
    fetchArticles,
    fetchTags,
} from '../../actions';

import {
    tagsPath
} from '../../constants/routesHelper';

import {
    homeHomeLimit,
    homePopularsLimit,
} from '../modules/constants';

import Loader from '../theme/loader';

import ArticleMiniCardDisplay from '../articles/display/items/miniCard';
import TagChipDisplay from '../tags/display/chip';
import MiniArticleSkeleton from '../loaders/skeletons/miniArticle';

export default @connect((state) => ({
    homeArticles: state.articleState.homeArticles,
    popularArticles: state.articleState.popularArticles,
    popularTags: state.tagState.popularTags
}), {
    fetchArticles,
    fetchTags,
})
class HomePopulars extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        // from connect
        homeArticles: PropTypes.array,
        popularArticles: PropTypes.array,
        popularTags: PropTypes.array,
        fetchArticles: PropTypes.func,
        fetchTags: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this._request = null;
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
            populars: true,
            limit: homePopularsLimit
        }, {
            populars: true
        });
    }

    render() {
        return (
            <section className={this.props.classes.populars}>
                <div className={this.props.classes.homeContent}>
                    <h2 className={this.props.classes.popularsTitle}>
                        {I18n.t('js.views.home.populars.title')}
                    </h2>

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
                                <>
                                    <Grid item={true}
                                          xs={12}
                                          sm={6}>
                                        <MiniArticleSkeleton/>
                                    </Grid>
                                    <Grid item={true}
                                          xs={12}
                                          sm={6}>
                                        <MiniArticleSkeleton/>
                                    </Grid>
                                </>
                        }
                    </Grid>

                    <Divider className={this.props.classes.popularsDivider}/>

                    <div className={this.props.classes.popularsCategory}>
                        <h2 className={this.props.classes.popularsSubtitle}>
                            {I18n.t('js.views.home.populars.tags.title')}
                        </h2>

                        <div>
                            {
                                this.props.popularTags?.length > 0
                                    ?
                                    this.props.popularTags.map((tag) => (
                                        <div key={tag.id}
                                             className={this.props.classes.popularsTag}>
                                            <TagChipDisplay tag={tag}
                                                            isLarge={true}/>
                                        </div>
                                    ))
                                    :
                                    <div className="center">
                                        <Loader size="big"/>
                                    </div>
                            }
                        </div>

                        <div className={this.props.classes.popularsButton}>
                            <Button color="primary"
                                    variant="contained"
                                    href={tagsPath()}>
                                {I18n.t('js.views.home.populars.tags.button')}
                            </Button>
                        </div>
                    </div>

                    <Divider className={this.props.classes.popularsDivider}/>

                    <div className={this.props.classes.popularsCategory}>
                        <h2 className={this.props.classes.popularsSubtitle}>
                            {I18n.t('js.views.home.populars.articles.title')}
                        </h2>

                        <div>
                            {
                                this.props.popularArticles?.length > 0
                                    ?
                                    this.props.popularArticles.filter((article) => !this.props.homeArticles.map((homeArticle) => homeArticle.id).includes(article.id)).map((article) => (
                                        <Paper key={article.id}
                                               className={this.props.classes.popularsItem}>
                                            <ArticleMiniCardDisplay article={article}/>
                                        </Paper>
                                    ))
                                    :
                                    <div>
                                        <MiniArticleSkeleton/>
                                        <MiniArticleSkeleton/>
                                        <MiniArticleSkeleton/>
                                    </div>
                            }
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
