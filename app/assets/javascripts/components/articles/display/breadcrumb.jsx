'use strict';

import {
    Link
} from 'react-router-dom';

const ArticleBreadcrumbDisplay = ({user, topic, article}) => (
    <ul className="article-breadcrumb"
        itemType="http://schema.org/BreadcrumbList"
        itemScope={true}>
        <li className="article-breadcrumb-item"
            itemType="http://schema.org/ListItem"
            itemProp="itemListElement"
            itemScope={true}>
            <Link to={`/users/${user.slug}`}
                  itemType="http://schema.org/Thing"
                  itemProp="item"
                  itemScope={true}>
                <span itemProp="name">
                    {user.pseudo}
                </span>
            </Link>
            <meta itemProp="position"
                  content="1"/>
        </li>
        >
        <li className="article-breadcrumb-item"
            itemType="http://schema.org/ListItem"
            itemProp="itemListElement"
            itemScope={true}>
            <Link to={`/users/${user.slug}/topics/${topic.slug}`}
                  itemType="http://schema.org/Thing"
                  itemProp="item"
                  itemScope={true}>
                <span itemProp="name">
                    {topic.name}
                </span>
            </Link>
            <meta itemProp="position"
                  content="2"/>
        </li>
        {
            article && article.title &&
            '>'
        }
        {
            article &&
            <li className="article-breadcrumb-item"
                itemType="http://schema.org/ListItem"
                itemProp="itemListElement"
                itemScope={true}>
                <Link to={`/users/${article.user.slug}/articles/${article.slug}`}
                      itemType="http://schema.org/Thing"
                      itemProp="item"
                      itemScope={true}>
                    <span itemProp="name">
                        {article.title}
                    </span>
                </Link>
                <meta itemProp="position"
                      content="3"/>
            </li>
        }
    </ul>
);

ArticleBreadcrumbDisplay.propTypes = {
    user: PropTypes.object.isRequired,
    topic: PropTypes.object.isRequired,
    article: PropTypes.object
};

export default ArticleBreadcrumbDisplay;
