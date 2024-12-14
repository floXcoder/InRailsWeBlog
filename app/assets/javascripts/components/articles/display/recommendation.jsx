import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import {
    Link
} from 'react-router';

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

import I18n from '@js/modules/translations';

import {
    fetchTag
} from '@js/actions/tagActions';

import {
    getAssociatedTopics
} from '@js/selectors/tagSelectors';

import {
    taggedTopicArticlesPath
} from '@js/constants/routesHelper';


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
        if (!this.props.associatedTopics || !this.props.associatedTopics.length) {
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
                                  className="article-recommendation-grid-theme"
                                  size={{
                                      xs: 12,
                                      sm: 6,
                                      lg: 4
                                  }}>
                                <Link to={{
                                    pathname: taggedTopicArticlesPath(this.props.userSlug, topic.slug, this.props.tagSlug)
                                }}>
                                    <Paper className="article-recommendation-topic"
                                           elevation={1}>
                                        <Typography className="article-recommendation-topic-title"
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

export default connect((state) => ({
    tag: state.tagState.tag,
    associatedTopics: getAssociatedTopics(state)
}), {
    fetchTag
})(ArticleRecommendationDisplay);