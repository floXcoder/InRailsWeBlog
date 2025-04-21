import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import * as Utils from '@js/modules/utils';

import {
    fetchSharedArticle
} from '@js/actions/articleActions';

import {
    userArticlePath
} from '@js/constants/routesHelper';

import withRouter from '@js/components/modules/router';

import highlight from '@js/components/modules/highlight';

import Loader from '@js/components/theme/loader';

import NotFound from '@js/components/layouts/notFound';


class ArticleShared extends React.Component {
    static propTypes = {
        // from router
        routeParams: PropTypes.object,
        // from connect
        currentUserId: PropTypes.number,
        isFetching: PropTypes.bool,
        article: PropTypes.object,
        fetchSharedArticle: PropTypes.func,
        // from highlight
        onShow: PropTypes.func
    };

    constructor(props) {
        super(props);

        this._request = null;
    }

    componentDidMount() {
        this._request = this.props.fetchSharedArticle(this.props.routeParams.articleSlug, this.props.routeParams.publicLink);
    }

    componentDidUpdate(prevProps) {
        if (this.props.article) {
            // Highlight code
            this.props.onShow(this.props.article.id, true);
        }

        this._checkArticleOwner();

        if (this.props.article && (!Object.equals(this.props.routeParams, prevProps.routeParams) || this.props.article.slug !== this.props.routeParams.articleSlug)) {
            this._request = this.props.fetchSharedArticle(this.props.routeParams.articleSlug, this.props.routeParams.publicLink);
        }
    }

    componentWillUnmount() {
        if (this._request?.signal) {
            this._request.signal.abort();
        }
    }

    _checkArticleOwner = () => {
        if (this.props.currentUserId && this.props.article?.userId === this.props.currentUserId) {
            window.location.replace(userArticlePath(this.props.article.user.slug, this.props.article.slug));
        }
    };

    render() {
        if (!this.props.article && !this.props.isFetching) {
            return (
                <div className="center margin-top-20">
                    <NotFound/>
                </div>
            );
        }

        if (!this.props.article) {
            return (
                <div className="article-show-root">
                    <div className="center">
                        <Loader size="big"/>
                    </div>
                </div>
            );
        }

        return (
            <article className="article-show-root">
                <Grid container={true}>
                    {
                        !!this.props.article.summary &&
                        <Grid size={{xs: 12}}>
                            <h2>
                                {this.props.article.summary}
                            </h2>
                        </Grid>
                    }
                </Grid>

                <Typography className="article-show-title"
                            variant="h1">
                    {this.props.article.title}
                </Typography>

                <div className="article-show-content normalized-content"
                     dangerouslySetInnerHTML={{__html: this.props.article.content}}/>

                {
                    !!this.props.article.reference &&
                    <div>
                        <a href={this.props.article.reference}
                           rel="noopener noreferrer"
                           target="_blank">
                            {Utils.normalizeLink(this.props.article.reference)}
                        </a>
                    </div>
                }
            </article>
        );
    }
}

export default connect((state) => ({
    currentUserId: state.userState.currentId,
    isFetching: state.articleState.isFetching,
    article: state.articleState.article
}), {
    fetchSharedArticle
})(withRouter({params: true})(highlight(false)(ArticleShared)));
