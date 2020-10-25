'use strict';

import {
    Link
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import {
    userArticlesPath,
    topicArticlesPath,
    userArticlePath,
    taggedArticlesPath
} from '../../../constants/routesHelper';

import {
    spyTrackClick
} from '../../../actions';

import styles from '../../../../jss/article/breadcrumb';

export default @withStyles(styles)
class ArticleBreadcrumbDisplay extends React.Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        topic: PropTypes.object.isRequired,
        article: PropTypes.object,
        tags: PropTypes.array,
        // from styles
        classes: PropTypes.object
    };

    _handleElementClick = (elementType, elementId, elementSlug, elementUserId, elementTitle, elementParentId, event) => {
        spyTrackClick(elementType, elementId, elementSlug, elementUserId, elementTitle, elementParentId);

        return event;
    };

    render() {
        return (
            <ul className={this.props.classes.breadcrumb}
                aria-label="Breadcrumb navigation"
                itemType="http://schema.org/BreadcrumbList"
                itemScope={true}>
                <li className={this.props.classes.breadcrumbItem}
                    itemType="http://schema.org/ListItem"
                    itemProp="itemListElement"
                    itemScope={true}>
                    <Link className={this.props.classes.breadcrumbLink}
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

                <li className={this.props.classes.breadcrumbSeparator}>
                    <KeyboardArrowRight/>
                </li>

                <li className={this.props.classes.breadcrumbItem}
                    itemType="http://schema.org/ListItem"
                    itemProp="itemListElement"
                    itemScope={true}>
                    <Link className={classNames(this.props.classes.breadcrumbLink, {
                        [this.props.classes.breadcrumbLast]: !this.props.article
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
                    this.props.article?.title &&
                    <>
                        <li className={this.props.classes.breadcrumbSeparator}>
                            <KeyboardArrowRight/>
                        </li>

                        <li className={this.props.classes.breadcrumbItem}
                            itemType="http://schema.org/ListItem"
                            itemProp="itemListElement"
                            itemScope={true}>
                            <Link
                                className={classNames(this.props.classes.breadcrumbLink, this.props.classes.breadcrumbLast)}
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
                    this.props.tags &&
                    <li>
                        {
                            this.props.tags.map((tag) => (
                                <Chip key={tag.id}
                                      classes={{
                                          root: this.props.classes.breadcrumbTag,
                                          label: this.props.classes.breadcrumbTagLabel
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
