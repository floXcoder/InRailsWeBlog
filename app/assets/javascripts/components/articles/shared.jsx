'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
    withRouter
} from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import {
    fetchSharedArticle
} from '../../actions';

import {
    userArticlePath
} from '../../constants/routesHelper';

import highlight from '../modules/highlight';

import Loader from '../theme/loader';

import NotFound from '../layouts/notFound';


export default @withRouter
@connect((state) => ({
    currentUserId: state.userState.currentId,
    isFetching: state.articleState.isFetching,
    article: state.articleState.article
}), {
    fetchSharedArticle
})
@hot
@highlight(false)
class ArticleShared extends React.Component {
    static propTypes = {
        routeParams: PropTypes.object.isRequired,
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

        if (!Object.equals(this.props.routeParams, prevProps.routeParams)) {
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
                        this.props.article.summary &&
                        <Grid item={true}
                              xs={12}>
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
                    this.props.article.reference &&
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
