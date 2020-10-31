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

const stripTags = (string) => string?.replace(/(<([^>]+)>)/ig, '');
const diffRenderStyle = {display: 'inline'};

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
            <div style={diffRenderStyle}
                 dangerouslySetInnerHTML={{
                     __html: str
                 }}/>
        );
    };

    _renderDiffTitle = (index, version) => {
        if (version.article.languages?.length > 1) {
            return (
                <div>
                    {
                        version.article.languages.map((locale) => {
                            const previousVersion = index === 0 ? this.props.currentArticle.titleTranslations[locale] : version.article.title_translations[locale];
                            const newVersion = this.props.articleVersions[index + 1].article.title_translations[locale];

                            if(previousVersion !== newVersion) {
                                return (
                                    <div key={locale}
                                         className="margin-top-20">
                                        <h4>
                                            {I18n.t(`js.languages.${locale}`)}
                                        </h4>

                                        <ReactDiffViewer hideLineNumbers={true}
                                                         useDarkTheme={false}
                                                         compareMethod={DiffMethod.WORDS}
                                                         oldValue={previousVersion}
                                                         newValue={newVersion}/>
                                    </div>
                                );
                            } else {
                                return null;
                            }
                        })
                    }
                </div>
            );
        } else {
            return (
                <ReactDiffViewer hideLineNumbers={true}
                                 useDarkTheme={false}
                                 compareMethod={DiffMethod.WORDS}
                                 oldValue={index === 0 ? this.props.currentArticle.title : version.article.title}
                                 newValue={this.props.articleVersions[index + 1].article.title}/>
            );
        }
    };

    _renderDiffContent = (index, version) => {
        if (version.article.languages?.length > 1) {
            return (
                <div>
                    {
                        version.article.languages.map((locale) => {
                            const previousVersion = stripTags(this.props.articleVersions[index + 1].article.content_translations[locale]);
                            const newVersion = stripTags(index === 0 ? this.props.currentArticle.contentTranslations[locale] : version.article.content_translations[locale])

                            if(previousVersion !== newVersion) {
                                return (
                                    <div key={locale}
                                         className="margin-top-20">
                                        <h4>
                                            {I18n.t(`js.languages.${locale}`)}
                                        </h4>

                                        <ReactDiffViewer splitView={true}
                                                         hideLineNumbers={true}
                                                         useDarkTheme={false}
                                                         compareMethod={DiffMethod.WORDS}
                                                         renderContent={this._formatDiffRender}
                                                         oldValue={previousVersion}
                                                         newValue={newVersion}/>
                                    </div>
                                );
                            } else {
                                return null;
                            }
                        })
                    }
                </div>
            );
        } else {
            return (
                <ReactDiffViewer splitView={true}
                                 hideLineNumbers={true}
                                 useDarkTheme={false}
                                 compareMethod={DiffMethod.WORDS}
                                 renderContent={this._formatDiffRender}
                                 oldValue={stripTags(this.props.articleVersions[index + 1].article.content)}
                                 newValue={stripTags(index === 0 ? this.props.currentArticle.content : version.article.content)}/>
            );
        }
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
                                                this._renderDiffTitle(i, version)
                                        }
                                    </h2>

                                    <CardContent classes={{
                                        root: this.props.classes.content
                                    }}>
                                        {
                                            i < this.props.articleVersions.length - 1
                                                ?
                                                this._renderDiffContent(i, version)
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
