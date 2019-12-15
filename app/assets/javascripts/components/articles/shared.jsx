'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
    withRouter
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import {
    fetchSharedArticle
} from '../../actions';

import highlight from '../modules/highlight';

import Loader from '../theme/loader';

import HeadLayout from '../layouts/head';
import NotFound from '../layouts/notFound';

import styles from '../../../jss/article/show';

export default @withRouter
@connect((state) => ({
    metaTags: state.articleState.metaTags,
    isFetching: state.articleState.isFetching,
    article: state.articleState.article
}), {
    fetchSharedArticle
})
@hot
@highlight(false)
@withStyles(styles)
class ArticleShared extends React.Component {
    static propTypes = {
        routeParams: PropTypes.object.isRequired,
        // from connect
        metaTags: PropTypes.object,
        isFetching: PropTypes.bool,
        article: PropTypes.object,
        fetchSharedArticle: PropTypes.func,
        // from highlight
        onShow: PropTypes.func,
        // from styles
        classes: PropTypes.object
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

        if (!Object.equals(this.props.routeParams, prevProps.routeParams)) {
            this._request = this.props.fetchSharedArticle(this.props.routeParams.articleSlug, this.props.routeParams.publicLink);
        }
    }

    componentWillUnmount() {
        if (this._request && this._request.signal) {
            this._request.signal.abort();
        }
    }

    render() {
        if (!this.props.article && !this.props.isFetching) {
            return (
                <div className="center margin-top-20">
                    <NotFound/>
                </div>
            )
        }

        if (!this.props.article) {
            return (
                <div className={this.props.classes.root}>
                    <div className="center">
                        <Loader size="big"/>
                    </div>
                </div>
            );
        }

        return (
            <article className={this.props.classes.root}>
                <HeadLayout>
                    {this.props.metaTags}
                </HeadLayout>

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

                <Typography className={this.props.classes.title}
                            variant="h1">
                    {this.props.article.title}
                </Typography>

                <div className={classNames('normalized-content', this.props.classes.content)}
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
