'use strict';

import {
    Link
} from 'react-router-dom';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import {
    userArticlePath,
    taggedArticlesPath
} from '../../../../constants/routesHelper';

import {
    spyTrackClick
} from '../../../../actions';

import ArticleInventoryDisplay from '../../../articles/display/items/inventory';


export default class ArticleItemDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
    }

    _handleArticleClick = () => {
        spyTrackClick('article', this.props.article.id, this.props.article.slug, this.props.article.userId, this.props.article.title, this.props.article.topicId);
    };

    render() {
        const isInventoryMode = this.props.article.mode === 'inventory';

        return (
            <Card className="search-index-article-card"
                  component="article">
                <CardHeader
                    classes={{
                        content: 'search-index-article-card-header'
                    }}
                    title={
                        <Link className="search-index-article-grid-title"
                              to={userArticlePath(this.props.article.user.slug, this.props.article.slug)}
                              onClick={this._handleArticleClick}>
                            {
                                isInventoryMode
                                    ?
                                    <Typography component="div"
                                                noWrap={true}>
                                        <span dangerouslySetInnerHTML={{__html: this.props.article.title}}/>
                                    </Typography>
                                    :
                                    <span dangerouslySetInnerHTML={{__html: this.props.article.title}}/>
                            }
                        </Link>
                    }
                    subheader={
                        <span className="search-index-article-subtitle">
                            {`(${this.props.article.date} - ${this.props.article.user.pseudo})`}
                        </span>
                    }
                />

                <CardContent classes={{
                    root: 'search-index-article-content'
                }}>
                    {
                        this.props.article.mode === 'inventory'
                            ?
                            <ArticleInventoryDisplay isList={true}
                                                     inventories={this.props.article.inventories}/>
                            :
                            <div className="normalized-content"
                                 dangerouslySetInnerHTML={{__html: this.props.article.content}}/>
                    }

                    {
                        !!this.props.article.scrapResults &&
                        <div className="search-index-article-links-results">
                            {
                                this.props.article.scrapResults.slice(1).map((resultsByLink, i) => (
                                    <div key={i}>
                                        <a href={this.props.article.scrapResults[0]}>
                                            {this.props.article.scrapResults[0]}
                                        </a>

                                        <ul>
                                            {
                                                resultsByLink.map((result, j) => (
                                                    <li key={j}>
                                                        {result}
                                                    </li>
                                                ))
                                            }
                                        </ul>

                                        {
                                            i !== this.props.article.scrapResults.length - 2 &&
                                            <Divider className="margin-top-5 margin-bottom-15"/>
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    }
                </CardContent>

                {
                    this.props.article.tags.length > 0 &&
                    <CardActions className="search-index-actions"
                                 disableSpacing={true}>
                        <div className="search-index-article-tags">
                            {
                                this.props.article.tags.map((tag) => (
                                    <Chip key={tag.id}
                                          className="search-index-article-tag"
                                          component={Link}
                                          to={taggedArticlesPath(tag.slug)}
                                          label={tag.name}
                                          clickable={true}
                                          variant="outlined"/>
                                ))
                            }
                        </div>
                    </CardActions>
                }
            </Card>
        );
    }
}
