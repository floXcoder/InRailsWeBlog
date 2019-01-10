'use strict';

import {
    Link
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';

import styles from '../../../../jss/article/breadcrumb';

export default @withStyles(styles)
class ArticleBreadcrumbDisplay extends React.Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        topic: PropTypes.object.isRequired,
        article: PropTypes.object,
        // from styles
        classes: PropTypes.object
    };

    render() {
        return (
            <ul className={this.props.classes.breadcrumb}
                itemType="http://schema.org/BreadcrumbList"
                itemScope={true}>
                <li className={this.props.classes.breadcrumbItem}
                    itemType="http://schema.org/ListItem"
                    itemProp="itemListElement"
                    itemScope={true}>
                    <Link className={this.props.classes.breadcrumbLink}
                          to={`/users/${this.props.user.slug}`}
                          itemType="http://schema.org/Thing"
                          itemProp="item"
                          itemScope={true}>
                        <span itemProp="name">
                            {this.props.user.pseudo}
                        </span>
                    </Link>
                    <meta itemProp="position"
                          content="1"/>
                </li>
                >
                <li className={this.props.classes.breadcrumbItem}
                    itemType="http://schema.org/ListItem"
                    itemProp="itemListElement"
                    itemScope={true}>
                    <Link className={this.props.classes.breadcrumbLink}
                          to={`/users/${this.props.user.slug}/topics/${this.props.topic.slug}`}
                          itemType="http://schema.org/Thing"
                          itemProp="item"
                          itemScope={true}>
                        <span itemProp="name">
                            {this.props.topic.name}
                        </span>
                    </Link>
                    <meta itemProp="position"
                          content="2"/>
                </li>
                {
                    this.props.article && this.props.article.title &&
                    '>'
                }
                {
                    this.props.article &&
                    <li className={this.props.classes.breadcrumbItem}
                        itemType="http://schema.org/ListItem"
                        itemProp="itemListElement"
                        itemScope={true}>
                        <Link className={this.props.classes.breadcrumbLink}
                              to={`/users/${this.props.article.user.slug}/articles/${this.props.article.slug}`}
                              itemType="http://schema.org/Thing"
                              itemProp="item"
                              itemScope={true}>
                            <span itemProp="name">
                                {this.props.article.title}
                            </span>
                        </Link>
                        <meta itemProp="position"
                              content="3"/>
                    </li>
                }
            </ul>
        );
    }
}
