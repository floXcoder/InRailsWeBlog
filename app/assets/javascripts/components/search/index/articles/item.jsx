import React from 'react';
import PropTypes from 'prop-types';

import {
    Link
} from 'react-router';

import classNames from 'classnames';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';

import {
    userArticlePath,
    taggedArticlesPath
} from '@js/constants/routesHelper';

import {
    spyTrackClick
} from '@js/actions/metricsActions';

import ArticleInventoryDisplay from '@js/components/articles/display/items/inventory';


export default class ArticleSearchItemDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        highlightTagIds: PropTypes.array
    };

    static defaultProps = {
        highlightTagIds: []
    };

    constructor(props) {
        super(props);
    }

    _handleArticleClick = () => {
        spyTrackClick('article', this.props.article.id, this.props.article.slug, this.props.article.userId, this.props.article.title, this.props.article.topicId);
    };

    render() {
        return (
            <Card className="search-index-article-card"
                  component="article">
                <CardHeader title={
                    <Link className="search-index-article-title"
                          to={userArticlePath(this.props.article.user.slug, this.props.article.slug)}
                          onClick={this._handleArticleClick}>
                        <span dangerouslySetInnerHTML={{__html: this.props.article.title}}/>
                    </Link>
                }
                            subheader={
                                <span className="search-index-article-subtitle">
                                    {`(${this.props.article.date} - ${this.props.article.user.pseudo})`}
                                </span>
                            }/>

                <CardContent classes={{
                    root: 'search-index-article-content'
                }}>
                    {
                        this.props.article.mode === 'inventory'
                            ?
                            <ArticleInventoryDisplay inventories={this.props.article.inventories}/>
                            :
                            <div className="normalized-content"
                                 dangerouslySetInnerHTML={{__html: this.props.article.content}}/>
                    }

                    {
                        !!this.props.article.scrapResults &&
                        <div className="search-index-article-links-results">
                            {
                                this.props.article.scrapResults.slice(1)
                                    .map((resultsByLink, i) => (
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

                    <div className="search-index-article-tags">
                        {
                            this.props.article.tags.map((tag) => (
                                <Chip key={tag.id}
                                      className={
                                          classNames('search-index-article-tag', {
                                              'search-index-article-highlighted-tag': this.props.highlightTagIds.includes(tag.id)
                                          })
                                      }
                                      component={Link}
                                      to={taggedArticlesPath(tag.slug)}
                                      onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.userId, tag.name, null)}
                                      label={tag.name}
                                      clickable={true}
                                      variant="outlined"/>
                            ))
                        }
                    </div>
                </CardContent>
            </Card>
        );
    }
}
