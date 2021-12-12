'use strict';

import {
    Link
} from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import {
    fetchTag,
} from '../../../actions';

import {
    getAssociatedTopics,
} from '../../../selectors';

import {
    taggedTopicArticlesPath
} from '../../../constants/routesHelper';


export default @connect((state) => ({
    tag: state.tagState.tag,
    associatedTopics: getAssociatedTopics(state)
}), {
    fetchTag
})
class ArticleRecommendationDisplay extends React.Component {
    static propTypes = {
        userSlug: PropTypes.string.isRequired,
        tagSlug: PropTypes.string.isRequired,
        // from connect
        tag: PropTypes.object,
        fetchTag: PropTypes.func,
        associatedTopics: PropTypes.array
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.tagSlug) {
            this.props.fetchTag(this.props.tagSlug, {recommendation: true});
        }
    }

    render() {
        if (!this.props.associatedTopics) {
            return null;
        }

        return (
            <Paper className="article-recommendation-paper">
                <Typography component="h3"
                            variant="h6">
                    {I18n.t('js.article.recommendation.title')}
                </Typography>

                <Grid container={true}
                      spacing={4}
                      direction="row"
                      justifyContent="flex-start"
                      alignItems="center">
                    {
                        this.props.associatedTopics.map((topic) => (
                            <Grid key={topic.id}
                                  className="article-recommendation-gridTheme"
                                  item={true}
                                  xs={12}
                                  sm={6}
                                  lg={4}>
                                <Link to={{
                                    pathname: taggedTopicArticlesPath(this.props.userSlug, topic.slug, this.props.tagSlug)
                                }}>
                                    <Paper className="article-recommendation-topic"
                                           elevation={1}>
                                        <Typography className="article-recommendation-topicTitle"
                                                    variant="h5"
                                                    component="h2">
                                            {topic.name} / {this.props.tag.name}
                                        </Typography>
                                    </Paper>
                                </Link>
                            </Grid>
                        ))
                    }
                </Grid>
            </Paper>
        );
    }
}
