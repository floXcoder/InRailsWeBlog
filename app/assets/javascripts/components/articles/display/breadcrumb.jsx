'use strict';

import {
    Link
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import styles from '../../../../jss/article/breadcrumb';

export default @withStyles(styles)
class ArticleBreadcrumbDisplay extends React.Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        topic: PropTypes.object.isRequired,
        article: PropTypes.object,
        tags: PropTypes.object,
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
                    </>
                }

                {
                    this.props.tags &&
                    this.props.tags.map((tag) => (
                        <Chip key={tag.id}
                              classes={{
                                  root: this.props.classes.breadcrumbTag,
                                  label: this.props.classes.breadcrumbTagLabel
                              }}
                              label={tag.name}
                              variant="outlined"
                              component={Link}
                              to={`/tagged/${tag.slug}`}/>
                    ))
                }
            </ul>
        );
    }
}
