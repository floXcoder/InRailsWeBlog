'use strict';

import ReactDOMServer from 'react-dom/server';

import {
    withStyles
} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChangeHistoryIcon from '@material-ui/icons/ChangeHistory';

import Diff from '../../theme/diff';

import styles from '../../../../jss/article/history';

export default @withStyles(styles)
class ArticleVersionsDisplay extends React.Component {
    static propTypes = {
        currentArticle: PropTypes.object.isRequired,
        articleVersions: PropTypes.array.isRequired,
        onRestore: PropTypes.func.isRequired,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    state = {
        expanded: []
    };

    _handleFoldClick = (versionId) => {
        this.setState({
            expanded: this.state.expanded.addOrRemove(versionId)
        });
    };

    _handleRestoreClick = (articleId, versionId) => {
        this.props.onRestore(articleId, versionId);
    };

    render() {
        return (
            <>
                {
                    this.props.articleVersions.map((version, i) => {
                        return (
                            <Card key={i}
                                  component="article"
                                  className={this.props.classes.card}>
                                <CardHeader classes={{
                                    title: this.props.classes.versionTitle
                                }}
                                            action={
                                                <IconButton className={classNames(this.props.classes.expand, {
                                                    [this.props.classes.expandOpen]: this.state.expanded.includes(version.id)
                                                })}
                                                            aria-expanded={this.state.expanded.includes(version.id)}
                                                            aria-label="Show more"
                                                            onClick={this._handleFoldClick.bind(this, version.id)}>
                                                    <ExpandMoreIcon/>
                                                </IconButton>
                                            }
                                            title={
                                                <div className={this.props.classes.cardTitle}
                                                     onClick={this._handleFoldClick.bind(this, version.id)}>
                                                    <ChangeHistoryIcon/>
                                                    {` ${I18n.t('js.article.history.changed_at')} ${version.changedAt}`}
                                                </div>
                                            }
                                />

                                <Collapse in={this.state.expanded.includes(version.id)}
                                          timeout="auto"
                                          unmountOnExit={true}>
                                    <h2 className={this.props.classes.title}>
                                        {
                                            i < this.props.articleVersions.length - 1
                                                ?
                                                <Diff current={this.props.articleVersions[i + 1].article.title}
                                                      previous={i === 0 ? this.props.currentArticle.title : version.article.title}
                                                      type="chars"/>
                                                :
                                                version.article.title
                                        }
                                    </h2>

                                    <CardContent classes={{
                                        root: this.props.classes.content
                                    }}>
                                        <div className="normalized-content">
                                            {
                                                i < this.props.articleVersions.length - 1
                                                    ?
                                                    <div dangerouslySetInnerHTML={{
                                                        __html: ReactDOMServer.renderToString(<Diff
                                                            current={this.props.articleVersions[i + 1].article.content}
                                                            previous={i === 0 ? this.props.currentArticle.content : version.article.content}
                                                            type="words"/>)
                                                    }}/>
                                                    :
                                                    <div dangerouslySetInnerHTML={{__html: version.article.content}}/>
                                            }
                                        </div>
                                    </CardContent>

                                    <CardActions className={this.props.classes.actions}
                                                 disableActionSpacing={true}>
                                        <Button color="primary"
                                                onClick={this._handleRestoreClick.bind(this, version.article.id, version.id)}>
                                            {I18n.t('js.article.history.restore')}
                                        </Button>
                                    </CardActions>
                                </Collapse>
                            </Card>
                        );
                    })
                }
            </>
        );
    }
}
