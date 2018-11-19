'use strict';

import {
    withRouter,
    Link
} from 'react-router-dom';

import Observer from '@researchgate/react-intersection-observer';

import {
    withStyles
} from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/EditOutlined';

import {
    spyTrackClick,
    spyTrackView
} from '../../../actions';

import highlight from '../../modules/highlight';

import ArticleLinkIcon from '../icons/link';

import styles from '../../../../jss/article/inline';

export default @withRouter
@highlight()
@withStyles(styles)
class ArticleInlineDisplay extends React.PureComponent {
    static propTypes = {
        id: PropTypes.number.isRequired,
        content: PropTypes.string.isRequired,
        userSlug: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        onInlineEdit: PropTypes.func.isRequired,
        title: PropTypes.string,
        isMinimized: PropTypes.bool,
        isOwner: PropTypes.bool,
        onEnter: PropTypes.func,
        onExit: PropTypes.func,
        // from highlight
        onShow: PropTypes.func,
        // from withRouter
        history: PropTypes.object,
        // from styles
        classes: PropTypes.object
    };

    static defaultProps = {
        isMinimized: false,
        isOwner: false
    };

    constructor(props) {
        super(props);

        this._headerRed = null;
    }

    state = {
        isMinimized: this.props.isMinimized,
        isFolded: false,
        isOver: false
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.isMinimized !== nextProps.isMinimized) {
            return {
                ...prevState,
                isMinimized: nextProps.isMinimized,
                isFolded: nextProps.isMinimized
            };
        }

        return null;
    }

    _handleViewportChange = event => {
        if (event.isIntersecting) {
            spyTrackView('article', this.props.id);

            if (this.props.onShow) {
                this.props.onShow(this.props.id);
            }

            if (this.props.onEnter) {
                this.props.onEnter({
                    id: this.props.id
                });
            }
        } else {
            if (this.props.onExit) {
                this.props.onExit({
                    id: this.props.id
                });
            }
        }
    };

    _handleTitleClick = (event) => {
        event.preventDefault();

        spyTrackClick('article', this.props.id, this.props.slug, this.props.title);

        const position = ReactDOM.findDOMNode(this._headerRed).getBoundingClientRect();

        this.props.history.push({
            pathname: `/users/${this.props.userSlug}/articles/${this.props.slug}`,
            state: {
                position: {x: position.x, y: position.y},
                title: this.props.title
            }
        });
    };

    _handleFoldClick = (event) => {
        event.preventDefault();

        this.setState({
            isFolded: !this.state.isFolded
        });
    };

    _handleOverEdit = () => {
        this.setState({
            isOver: !this.state.isOver
        })
    };

    render() {
        return (
            <Observer onChange={this._handleViewportChange}>
                <article id={this.props.id}
                         className={classNames(
                    this.props.classes.root, {
                        [this.props.classes.over]: this.state.isOver
                    })}>
                    <IconButton className={this.props.classes.expand}
                                aria-expanded={this.state.isFolded}
                                aria-label="Show more"
                                onClick={this._handleFoldClick}>
                        <ExpandMoreIcon/>
                    </IconButton>

                    {
                        this.props.title &&
                        <Link innerRef={(ref) => this._headerRed = ref}
                              to={`/users/${this.props.userSlug}/articles/${this.props.slug}`}
                              onClick={this._handleTitleClick}>
                            <h1 className={this.props.classes.title}>
                                {this.props.title}
                            </h1>
                        </Link>
                    }

                    <Collapse in={!this.state.isFolded}
                              timeout="auto"
                              unmountOnExit={true}>
                        <div className="normalized-content"
                             dangerouslySetInnerHTML={{__html: this.props.content}}/>
                    </Collapse>

                    {
                        !this.state.isFolded &&
                        <div className={this.props.classes.floatingButtons}>
                            <div className={this.props.classes.floatingIcons}>
                                <ArticleLinkIcon articleId={this.props.id}
                                                 articleSlug={this.props.slug}
                                                 articleTitle={this.props.title}
                                                 userSlug={this.props.userSlug}
                                                 size="default"
                                                 color="action"/>
                            </div>

                            {
                                this.props.isOwner &&
                                <div className={this.props.classes.floatingIcons}>
                                    <a className="tooltip-bottom"
                                       href="#"
                                       onMouseEnter={this._handleOverEdit}
                                       onMouseLeave={this._handleOverEdit}
                                       onClick={this.props.onInlineEdit}
                                       data-tooltip={I18n.t('js.article.tooltip.edit')}>
                                        <EditIcon color="action"
                                                  fontSize="default"/>
                                    </a>
                                </div>
                            }
                        </div>
                    }
                </article>
            </Observer>
        );
    }
}
