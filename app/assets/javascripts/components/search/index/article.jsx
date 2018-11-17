'use strict';

import {
    Link
} from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';

import FilterListIcon from '@material-ui/icons/FilterList';
import LabelIcon from '@material-ui/icons/Label';

import {
    spyTrackClick
} from '../../../actions';

import Dropdown from '../../theme/dropdown';

export default class SearchArticleIndex extends React.PureComponent {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        articles: PropTypes.array.isRequired,
        isSearching: PropTypes.bool.isRequired,
        onFilter: PropTypes.func.isRequired,
        onArticleClick: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    _handleFilter = (filter, event) => {
        event.preventDefault();

        this.props.onFilter(filter);
    };

    _handleArticleClick = (article, event) => {
        event.preventDefault();

        this.props.onArticleClick(article);
    };

    render() {
        return (
            <div className={this.props.classes.category}>
                <h2 className={this.props.classes.categoryName}>
                    {I18n.t('js.search.index.articles.title')}

                    <span className={this.props.classes.categoryCount}>
                        {`(${I18n.t('js.search.index.results', {count: this.props.articles.length})})`}
                    </span>

                    <div className={this.props.classes.categoryFilter}>
                        <Dropdown hasWavesEffect={false}
                                  isClosingOnInsideClick={true}
                                  hasArrow={true}
                                  position="bottom right"
                                  button={
                                      <Button className={this.props.classes.categoryFilterButton}
                                      >
                                          {I18n.t('js.search.index.filters.button')}
                                          <FilterListIcon/>
                                      </Button>
                                  }>
                            <ul>
                                <li>
                                    <a onClick={this._handleFilter.bind(this, 'priority')}>
                                        {I18n.t('js.search.filters.priority')}
                                    </a>
                                </li>

                                <li className="dropdown-divider">
                                    &nbsp;
                                </li>

                                <li>
                                    <a onClick={this._handleFilter.bind(this, 'date')}>
                                        {I18n.t('js.search.filters.date')}
                                    </a>
                                </li>

                                <li className="dropdown-divider">
                                    &nbsp;
                                </li>

                                <li>
                                    <a onClick={this._handleFilter.bind(this, 'all_topics')}>
                                        {I18n.t('js.search.filters.all_topics')}
                                    </a>
                                </li>
                            </ul>
                        </Dropdown>
                    </div>
                </h2>

                <div>
                    {
                        this.props.articles.map((article) => (
                            <Card key={article.id}
                                  className={this.props.classes.articleCard}
                                  component="article">
                                <CardHeader title={
                                    <Link className={this.props.classes.articleTitle}
                                          to={`/users/${article.user.slug}/articles/${article.slug}`}
                                          onClick={this._handleArticleClick.bind(this, article)}>
                                        <span className="title"
                                              dangerouslySetInnerHTML={{__html: article.title}}/>
                                    </Link>
                                }
                                            subheader={
                                                <span className={this.props.classes.articleSubtitle}>
                                                    {`(${article.date} - ${article.user.pseudo})`}
                                                </span>
                                            }
                                />

                                <CardContent classes={{
                                    root: this.props.classes.articleContent
                                }}>
                                    <div className="normalized-content"
                                         dangerouslySetInnerHTML={{__html: article.content}}/>

                                    <div className={this.props.classes.articleTags}>
                                        {
                                            article.tags.map((tag) => (
                                                <Chip key={tag.id}
                                                      className={this.props.classes.articleTag}
                                                      component={Link}
                                                      to={`/tagged/${tag.slug}`}
                                                      onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.name)}
                                                      icon={<LabelIcon/>}
                                                      label={tag.name}
                                                      clickable={true}
                                                      variant="outlined"/>
                                            ))
                                        }
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    }
                </div>
            </div>
        );
    }
}
