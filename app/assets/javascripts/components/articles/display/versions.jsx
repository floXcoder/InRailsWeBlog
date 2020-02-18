'use strict';

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

import ReactDiffViewer, {DiffMethod} from 'react-diff-viewer';

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

    _formatDiffRender = (str) => {
        return (
            <div style={{display: 'inline'}}
                 dangerouslySetInnerHTML={{
                     __html: str
                 }}/>
        );
    };

    render() {
        return (
            <>
                {
                    this.props.articleVersions.map((version, i) => {
                        const isInitialVersion = (i === this.props.articleVersions.length - 1);

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
                                                    {
                                                        isInitialVersion
                                                            ?
                                                            ` ${I18n.t('js.article.history.initial')} ${version.changedAt}`
                                                            :
                                                            ` ${I18n.t('js.article.history.changed_at')} ${version.changedAt}`
                                                    }
                                                </div>
                                            }
                                />

                                <Collapse in={this.state.expanded.includes(version.id)}
                                          timeout="auto"
                                          unmountOnExit={true}>
                                    <h2 className={this.props.classes.title}>
                                        {
                                            isInitialVersion
                                                ?
                                                version.article.title
                                                :
                                                <ReactDiffViewer
                                                    hideLineNumbers={true}
                                                    useDarkTheme={false}
                                                    compareMethod={DiffMethod.WORDS}
                                                    oldValue={i === 0 ? this.props.currentArticle.title : version.article.title}
                                                    newValue={this.props.articleVersions[i + 1].article.title}/>
                                        }
                                    </h2>

                                    <CardContent classes={{
                                        root: this.props.classes.content
                                    }}>
                                        {
                                            i < this.props.articleVersions.length - 1
                                                ?
                                                <ReactDiffViewer splitView={true}
                                                                 hideLineNumbers={true}
                                                                 useDarkTheme={false}
                                                                 compareMethod={DiffMethod.LINES}
                                                                 renderContent={this._formatDiffRender}
                                                                 oldValue={this.props.articleVersions[i + 1].article.content}
                                                                 newValue={i === 0 ? this.props.currentArticle.content : version.article.content}/>
                                                :
                                                <div dangerouslySetInnerHTML={{__html: version.article.content}}/>
                                        }
                                    </CardContent>

                                    <CardActions className={this.props.classes.actions}
                                                 disableSpacing={true}>
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
