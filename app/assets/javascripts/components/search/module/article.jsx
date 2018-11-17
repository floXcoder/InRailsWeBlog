'use strict';

import {
    Link
} from 'react-router-dom';

import Grid from '@material-ui/core/Grid';

// import EditIcon from '@material-ui/icons/Edit';

import {
    spyTrackClick
} from '../../../actions';

export default class SearchArticleModule extends React.PureComponent {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        articles: PropTypes.array.isRequired,
        hasQuery: PropTypes.bool.isRequired,
        isSearching: PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
    }

    _handleArticleClick = (article) => {
        spyTrackClick('article', article.id, article.slug, article.title);
    };

    render() {
        return (
            <div className={this.props.classes.category}>
                <h2 className={this.props.classes.categoryName}>
                    {I18n.t('js.search.module.articles.title')}
                    {
                        this.props.hasQuery &&
                        <span className={this.props.classes.categoryCount}>
                            {I18n.t('js.search.module.articles.recents')}
                        </span>
                    }
                </h2>

                <div>
                    {
                        this.props.articles.map((article) => (
                            <section key={article.id}>
                                <Grid container={true}
                                      spacing={16}
                                      direction="row"
                                      justify="flex-start"
                                      alignItems="center">
                                    <Grid item={true}>
                                        <Link className={this.props.classes.articleTitle}
                                              to={`/users/${article.user.slug}/articles/${article.slug}`}
                                              onClick={this._handleArticleClick.bind(this, article)}>
                                            {article.title || article.slug}
                                        </Link>
                                    </Grid>

                                    {/*<Grid item={true}>*/}
                                        {/*<Link to={`/users/${article.user.slug}/articles/${article.slug}/edit`}>*/}
                                            {/*<EditIcon className={this.props.classes.articleEdit}/>*/}
                                        {/*</Link>*/}
                                    {/*</Grid>*/}
                                </Grid>
                            </section>
                        ))
                    }
                </div>
            </div>
        );
    }
}
