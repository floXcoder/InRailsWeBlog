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
import CardActions from '@material-ui/core/CardActions';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';

import {
    spyTrackClick
} from '../../../../actions';

import ArticleInventoryDisplay from '../../../articles/display/items/inventory';

import styles from '../../../../../jss/search/index';

export default @withStyles(styles)
class ArticleItemDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    _handleArticleClick = () => {
        spyTrackClick('article', this.props.article.id, this.props.article.slug, this.props.article.title);
    };

    render() {
        const isInventoryMode = this.props.article.mode === 'inventory';

        return (
            <Card className={this.props.classes.articleCard}
                  component="article">
                <CardHeader
                    classes={{
                        content: this.props.classes.articleCardHeader
                    }}
                    title={
                        <Link className={this.props.classes.articleGridTitle}
                              to={`/users/${this.props.article.user.slug}/articles/${this.props.article.slug}`}
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
                        <span className={this.props.classes.articleSubtitle}>
                            {`(${this.props.article.date} - ${this.props.article.user.pseudo})`}
                        </span>
                    }
                />

                <CardContent classes={{
                    root: this.props.classes.articleContent
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
                </CardContent>

                {
                    this.props.article.tags.length > 0 &&
                    <CardActions className={this.props.classes.actions}
                                 disableSpacing={true}>
                        <div className={this.props.classes.articleTags}>
                            {
                                this.props.article.tags.map((tag) => (
                                    <Chip key={tag.id}
                                          className={this.props.classes.articleTag}
                                          component={Link}
                                          to={`/tagged/${tag.slug}`}
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
