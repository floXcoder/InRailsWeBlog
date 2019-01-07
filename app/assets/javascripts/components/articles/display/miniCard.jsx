'use strict';

import {
    Link
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';

import LabelIcon from '@material-ui/icons/Label';

import {
    spyTrackClick
} from '../../../actions';

import highlight from '../../modules/highlight';

import styles from '../../../../jss/article/miniCard';

export default @highlight()

@withStyles(styles)
class ArticleMiniCardDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        // from highlight
        // onShow: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    static defaultProps = {};

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Card key={this.props.article.id}
                  className={this.props.classes.card}
                  component="article">
                <CardHeader classes={{
                    root: this.props.classes.header,
                    subheader: this.props.classes.articleSubtitle,
                }}
                            title={
                                <Link to={`/users/${this.props.article.user.slug}/articles/${this.props.article.slug}`}
                                      onClick={spyTrackClick.bind(null, 'tag', this.props.article.id, this.props.article.slug, this.props.article.title)}>
                                    <h1 className={this.props.classes.title}>
                                        {this.props.article.title}
                                    </h1>
                                </Link>
                            }
                            subheader={
                                <div className={this.props.classes.articleTags}>
                                    {
                                        this.props.article.tags.map((tag) => (
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
                            }
                />

                <CardContent classes={{
                    root: this.props.classes.articleContent
                }}>
                    <Grid container={true}
                          classes={{
                              container: this.props.classes.info
                          }}
                          spacing={16}
                          direction="row"
                          justify="flex-start"
                          alignItems="center">
                        <Grid item={true}
                              xs={this.props.article.defaultPicture ? 8 : 12}
                              className={this.props.classes.headerItem}>
                            <div className="normalized-content normalized-content-extract"
                                 dangerouslySetInnerHTML={{__html: this.props.article.content}}/>

                        </Grid>

                        {
                            this.props.article.defaultPicture &&
                            <Grid item={true}
                                  xs={4}
                                  className={this.props.classes.headerItem}>
                                <CardMedia className={this.props.classes.media}
                                           image={this.props.article.defaultPicture}
                                           title={this.props.article.name}/>
                            </Grid>
                        }
                    </Grid>


                    <Grid container={true}
                          classes={{
                              container: this.props.classes.info
                          }}
                          spacing={16}
                          direction="row"
                          justify="flex-start"
                          alignItems="center">
                        <Grid item={true}
                              className={this.props.classes.headerItem}>
                            <Link className={this.props.classes.userPseudo}
                                  to={`/users/${this.props.article.user.slug}`}
                                  onClick={spyTrackClick.bind(null, 'user', this.props.article.user.id, this.props.article.user.slug, this.props.article.user.pseudo)}>
                                {this.props.article.user.pseudo}
                            </Link>
                        </Grid>

                        <Grid item={true}
                              className={this.props.classes.headerItem}>
                            <div className={this.props.classes.separator}/>
                        </Grid>

                        <Grid item={true}
                              className={this.props.classes.headerItem}>
                            <div className={this.props.classes.date}>
                                {this.props.article.date}
                            </div>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        );
    }
}
