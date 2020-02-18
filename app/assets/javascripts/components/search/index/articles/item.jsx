'use strict';

import {
    Link
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';

import {
    userArticlePath,
    taggedArticlesPath
} from '../../../../constants/routesHelper';

import {
    spyTrackClick
} from '../../../../actions';

import ArticleInventoryDisplay from '../../../articles/display/items/inventory';

import styles from '../../../../../jss/search/index';

export default @withStyles(styles)
class ArticleSearchItemDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        highlightTagIds: PropTypes.array,
        // from styles
        classes: PropTypes.object
    };

    static defaultProps = {
        highlightTagIds: []
    };

    constructor(props) {
        super(props);
    }

    _handleArticleClick = () => {
        spyTrackClick('article', this.props.article.id, this.props.article.slug, this.props.article.title);
    };

    render() {
        return (
            <Card className={this.props.classes.articleCard}
                  component="article">
                <CardHeader title={
                    <Link className={this.props.classes.articleTitle}
                          to={userArticlePath(this.props.article.user.slug, this.props.article.slug)}
                          onClick={this._handleArticleClick}>
                        <span dangerouslySetInnerHTML={{__html: this.props.article.title}}/>
                    </Link>
                }
                            subheader={
                                <span className={this.props.classes.articleSubtitle}>
                                    {`(${this.props.article.date} - ${this.props.article.user.pseudo})`}
                                </span>
                            }/>

                <CardContent classes={{
                    root: this.props.classes.articleContent
                }}>
                    {
                        this.props.article.mode === 'inventory'
                            ?
                            <ArticleInventoryDisplay inventories={this.props.article.inventories}/>
                            :
                            <div className="normalized-content"
                                 dangerouslySetInnerHTML={{__html: this.props.article.content}}/>
                    }

                    <div className={this.props.classes.articleTags}>
                        {
                            this.props.article.tags.map((tag) => (
                                <Chip key={tag.id}
                                      className={classNames(
                                          this.props.classes.articleTag,
                                          {
                                              [this.props.classes.articleHighlightedTag]: this.props.highlightTagIds.includes(tag.id)
                                          }
                                      )}
                                      component={Link}
                                      to={taggedArticlesPath(tag.slug)}
                                      onClick={spyTrackClick.bind(null, 'tag', tag.id, tag.slug, tag.name)}
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
