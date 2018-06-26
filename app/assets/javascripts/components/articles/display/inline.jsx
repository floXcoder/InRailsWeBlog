'use strict';

import {
    Link
} from 'react-router-dom';

import Waypoint from 'react-waypoint';

import highlight from '../../modules/highlight';

import {
    spyTrackClick,
    spyTrackView
} from '../../../actions';

@highlight()
export default class ArticleInlineDisplay extends React.PureComponent {
    static propTypes = {
        id: PropTypes.number.isRequired,
        content: PropTypes.string.isRequired,
        slug: PropTypes.string.isRequired,
        onInlineEdit: PropTypes.func.isRequired,
        title: PropTypes.string,
        isOwner: PropTypes.bool,
        onShow: PropTypes.func
    };

    static defaultProps = {
        isOwner: false,
        isOutdated: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        isOver: false
    };

    _handleWaypointEnter = () => {
        spyTrackView('article', this.props.id);

        if(this.props.onShow) {
            this.props.onShow(this.props.id);
        }
    };

    _handleOverEdit = () => {
        this.setState({
            isOver: !this.state.isOver
        })
    };

    render() {
        return (
            <div className={classNames(
                'article-inline-item', {
                    'article-inline-item-over': this.state.isOver
                })}>
                <Waypoint onEnter={this._handleWaypointEnter}/>
                <div className="article-inline-content">
                    {
                        this.props.title &&
                        <div className="article-inline-title">
                            <Link to={`/article/${this.props.slug}`}
                                  onClick={spyTrackClick.bind(null, 'article', this.props.id, this.props.slug, this.props.title)}>
                                <h2 className="title">
                                    {this.props.title}
                                </h2>
                            </Link>
                        </div>
                    }

                    <div className="blog-article-content"
                         dangerouslySetInnerHTML={{__html: this.props.content}}/>
                </div>

                <ul className="article-inline-actions">
                    <li className="action-inline-item">
                        <Link className="article-link tooltip-top"
                              to={`/article/${this.props.slug}`}
                              data-tooltip={I18n.t('js.article.tooltip.link_to')}
                              onClick={spyTrackClick.bind(null, 'article', this.props.id, this.props.slug, this.props.title)}>
                                <span className="material-icons"
                                      data-icon="open_in_new"
                                      aria-hidden="true"/>
                        </Link>
                    </li>

                    {
                        this.props.isOwner &&
                        <li className="action-inline-item">
                            <a className="article-edit tooltip-bottom"
                               data-tooltip={I18n.t('js.article.tooltip.edit')}
                               onMouseEnter={this._handleOverEdit}
                               onMouseLeave={this._handleOverEdit}
                               onClick={this.props.onInlineEdit}>
                                    <span className="material-icons"
                                          data-icon="edit"
                                          aria-hidden="true"/>
                            </a>
                        </li>
                    }
                </ul>
            </div>
        );
    }
}
