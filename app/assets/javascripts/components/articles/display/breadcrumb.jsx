'use strict';

import {
    Link
} from 'react-router-dom';

import Chip from '@mui/material/Chip';

import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

import {
    userArticlesPath,
    topicArticlesPath,
    userArticlePath,
    taggedArticlesPath
} from '../../../constants/routesHelper';

import {
    spyTrackClick
} from '../../../actions';


export default class ArticleBreadcrumbDisplay extends React.Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        topic: PropTypes.object.isRequired,
        article: PropTypes.object,
        tags: PropTypes.array
    };

    _handleElementClick = (elementType, elementId, elementSlug, elementUserId, elementTitle, elementParentId, event) => {
        spyTrackClick(elementType, elementId, elementSlug, elementUserId, elementTitle, elementParentId);

        return event;
    };

    render() {
        return (
            <ul className="article-breadcrumb-breadcrumb"
                aria-label="Breadcrumb navigation"
                itemType="http://schema.org/BreadcrumbList"
                itemScope={true}>
                <li className="article-breadcrumb-breadcrumb-item"
                    itemType="http://schema.org/ListItem"
                    itemProp="itemListElement"
                    itemScope={true}>
                    <Link className="article-breadcrumb-breadcrumb-link"
                          to={userArticlesPath(this.props.user.slug)}
                          itemType="http://schema.org/Thing"
                          itemProp="item"
                          onClick={this._handleElementClick.bind(this, 'user', this.props.user.id, this.props.user.slug, null, this.props.user.pseudo, null)}>
                        <span itemProp="name">
                            {this.props.user.pseudo}
                        </span>
                    </Link>
                    <meta itemProp="position"
                          content="1"/>
                </li>

                <li className="article-breadcrumb-breadcrumb-separator">
                    <KeyboardArrowRight/>
                </li>

                <li className="article-breadcrumb-breadcrumb-item"
                    itemType="http://schema.org/ListItem"
                    itemProp="itemListElement"
                    itemScope={true}>
                    <Link className={classNames('article-breadcrumb-breadcrumb-link', {
                        'article-breadcrumb-breadcrumb-last': !this.props.article
                    })}
                          to={topicArticlesPath(this.props.user.slug, this.props.topic.slug)}
                          itemType="http://schema.org/Thing"
                          itemProp="item"
                          onClick={this._handleElementClick.bind(this, 'topic', this.props.topic.id, this.props.topic.slug, this.props.topic.userId, this.props.topic.name, null)}>
                        <span itemProp="name">
                            {this.props.topic.name}
                            {
                                this.props.topic.mode !== 'default' &&
                                ` (${I18n.t(`js.topic.enums.mode.${this.props.topic.mode}`)})`
                            }
                        </span>
                    </Link>
                    <meta itemProp="position"
                          content="2"/>
                </li>

                {
                    !!this.props.article?.title &&
                    <>
                        <li className="article-breadcrumb-breadcrumb-separator">
                            <KeyboardArrowRight/>
                        </li>

                        <li className="article-breadcrumb-breadcrumb-item"
                            itemType="http://schema.org/ListItem"
                            itemProp="itemListElement"
                            itemScope={true}>
                            <Link
                                className="article-breadcrumb-breadcrumb-link article-breadcrumb-breadcrumb-last"
                                to={userArticlePath(this.props.article.user.slug, this.props.article.slug)}
                                itemType="http://schema.org/Thing"
                                itemProp="item"
                                onClick={this._handleElementClick.bind(this, 'article', this.props.article.id, this.props.article.slug, this.props.article.userId, this.props.article.title, this.props.topic.id)}>
                                <span itemProp="name">
                                    {this.props.article.title}
                                </span>
                            </Link>
                            <meta itemProp="position"
                                  content="3"/>
                        </li>
                    </>
                }

                {
                    !!this.props.tags &&
                    <li>
                        {
                            this.props.tags.map((tag) => (
                                <Chip key={tag.id}
                                      classes={{
                                          root: 'article-breadcrumb-breadcrumb-tag',
                                          label: 'article-breadcrumb-breadcrumb-tag-label'
                                      }}
                                      label={tag.name}
                                      variant="outlined"
                                      component={Link}
                                      to={taggedArticlesPath(tag.slug)}
                                      onClick={this._handleElementClick.bind(this, 'tag', tag.id, tag.slug, tag.userId, tag.name, null)}/>
                            ))
                        }
                    </li>
                }
            </ul>
        );
    }
}
