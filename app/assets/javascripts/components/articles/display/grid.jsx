'use strict';

import {
    Link
} from 'react-router-dom';

import Waypoint from 'react-waypoint';

import {
    spyTrackClick,
    spyTrackView
} from '../../../actions';

import highlight from '../../modules/highlight';

import ArticleTags from '../properties/tags';

@highlight()
export default class ArticleGridDisplay extends React.Component {
    static propTypes = {
        article: PropTypes.object.isRequired,
        isOwner: PropTypes.bool,
        isOutdated: PropTypes.bool,
        hasActions: PropTypes.bool,
        onClick: PropTypes.func,
        onShow: PropTypes.func
    };

    static defaultProps = {
        isOwner: false,
        isOutdated: false,
        hasActions: true
    };

    constructor(props) {
        super(props);
    }

    _handleWaypointEnter = () => {
        spyTrackView('article', this.props.article.id);

        if(this.props.onShow) {
            this.props.onShow(this.props.article.id);
        }
    };

    _handleClick = (event) => {
        event.preventDefault();

        spyTrackClick('article', this.props.article.id, this.props.article.slug, this.props.article.title);

        this.props.onClick();
    };

    render() {
        return (
            <div className="article-item article-grid">
                <Waypoint onEnter={this._handleWaypointEnter}/>
                <div className="article-content">
                    <div className="article-title">
                        {
                            this.props.article.title &&
                            <a href="#"
                               onClick={this._handleClick}>
                                <h2 className="title">
                                    {this.props.article.title}
                                </h2>
                            </a>
                        }

                        <span className={classNames('article-exposed-button', {'article-no-title': !this.props.article.title})}>
                            <a href="#"
                               onClick={this._handleClick}>
                               <span className="material-icons"
                                     data-icon="fullscreen"
                                     aria-hidden="true"/>
                            </a>
                        </span>
                    </div>

                    <div className="blog-article-content"
                         dangerouslySetInnerHTML={{__html: this.props.article.content}}/>

                    {
                        this.props.article.tags.size > 0 &&
                        <ArticleTags articleId={this.props.article.id}
                                     tags={this.props.article.tags}
                                     parentTagIds={this.props.article.parentTagIds}
                                     childTagIds={this.props.article.childTagIds}/>
                    }
                </div>
            </div>
        );
    }
}
