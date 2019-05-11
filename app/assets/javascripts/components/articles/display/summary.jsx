'use strict';

import {
    Link
} from 'react-router-dom';

import Observer from '@researchgate/react-intersection-observer';

import {
    withStyles
} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import {
    spyTrackClick,
    spyTrackView
} from '../../../actions';

import highlight from '../../modules/highlight';

import ArticleTags from '../properties/tags';
import ArticleAvatarIcon from '../icons/avatar';

import styles from '../../../../jss/article/summary';

export default @highlight()
@withStyles(styles)
class ArticleSummaryDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        className: PropTypes.string,
        onEnter: PropTypes.func,
        onExit: PropTypes.func,
        // from highlight
        onShow: PropTypes.func,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    state = {
        isVisible: false
    };

    _handleViewportChange = (event) => {
        if (event.isIntersecting) {
            spyTrackView('article', this.props.article.id);

            if (!this.state.isVisible) {
                this.setState({
                    isVisible: true
                });
            }

            if (this.props.onShow) {
                this.props.onShow(this.props.article.id);
            }

            if (this.props.onEnter) {
                this.props.onEnter(this.props.article);
            }
        } else {
            if (this.props.onExit) {
                this.props.onExit(this.props.article);
            }
        }
    };

    _handleTitleClick = () => {
        spyTrackClick('article', this.props.article.id, this.props.article.slug, this.props.article.title);
    };

    render() {
        return (
            <Observer onChange={this._handleViewportChange}>
                <div id={this.props.article.id}
                     className={classNames(this.props.className, {
                         'is-hidden': !this.state.isVisible,
                         'bounce-in': this.state.isVisible
                     })}>
                    <div className={this.props.classes.heading}>
                        <Grid container={true}
                              classes={{
                                  container: this.props.classes.info
                              }}
                              spacing={16}
                              direction="row"
                              justify="space-between"
                              alignItems="center">
                            <Grid classes={{
                                item: this.props.classes.infoItem
                            }}
                                  item={true}>
                                <ArticleAvatarIcon classes={this.props.classes}
                                                   user={this.props.article.user}
                                                   articleDate={this.props.article.date}/>
                            </Grid>
                        </Grid>

                        <Link
                            to={`/users/${this.props.article.user.slug}/articles/${this.props.article.slug}`}
                            onClick={this._handleTitleClick}>
                            <h1 className={this.props.classes.title}>
                                {this.props.article.title}
                            </h1>
                        </Link>
                    </div>

                    <div className={this.props.classes.content}>
                        <div className="normalized-content"
                             dangerouslySetInnerHTML={{__html: this.props.article.content}}/>
                    </div>

                    {
                        this.props.article.tags.size > 0 &&
                        <ArticleTags articleId={this.props.article.id}
                                     tags={this.props.article.tags}
                                     parentTagIds={this.props.article.parentTagIds}
                                     childTagIds={this.props.article.childTagIds}/>
                    }
                </div>
            </Observer>
        );
    }
}
