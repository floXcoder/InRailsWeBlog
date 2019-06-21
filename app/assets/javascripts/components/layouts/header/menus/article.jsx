'use strict';

import {Link} from 'react-router-dom';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import EditIcon from '@material-ui/icons/Edit';
import AssignmentIcon from '@material-ui/icons/Assignment';

export default class HeaderArticleMenu extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        routeParams: PropTypes.object.isRequired,
        userSlug: PropTypes.string.isRequired,
        currentTagSlugs: PropTypes.array.isRequired,
        hasTemporaryArticle: PropTypes.bool.isRequired,
        currentTopicMode: PropTypes.string,
        topicSlug: PropTypes.string,
        isNested: PropTypes.bool
    };

    static defaultProps = {
        isNested: false
    };

    render() {
        const parentTagSlug = this.props.routeParams.parentTagSlug || this.props.routeParams.tagSlug || this.props.currentTagSlugs[0];
        const childTagSlug = this.props.routeParams.childTagSlug || this.props.currentTagSlugs[1];

        return (
            <List className={classNames({
                [this.props.classes.nestedMenu]: this.props.isNested
            })}
                  component="div"
                  disablePadding={this.props.isNested}>
                <List component="div">
                    {
                        this.props.hasTemporaryArticle &&
                        <>
                            <ListItem button={true}
                                      component={Link}
                                      className={this.props.classes.link}
                                      to={{
                                          pathname: `/users/${this.props.userSlug}/topics/${this.props.topicSlug}/article-new`,
                                          state: {
                                              temporary: true
                                          }
                                      }}>
                                <ListItemIcon>
                                    <EditIcon/>
                                </ListItemIcon>

                                <ListItemText classes={{primary: this.props.classes.link}}>
                                    {I18n.t('js.views.header.article.menu.temporary')}
                                </ListItemText>
                            </ListItem>

                            <Divider/>
                        </>
                    }

                    <ListItem button={true}
                              component={Link}
                              className={this.props.classes.link}
                              to={{
                                  pathname: `/users/${this.props.userSlug}/topics/${this.props.topicSlug}/article-new`,
                                  state: {
                                      parentTagSlug: parentTagSlug,
                                      childTagSlug: childTagSlug
                                  }
                              }}>
                        <ListItemIcon>
                            <AssignmentIcon/>
                        </ListItemIcon>

                        <ListItemText classes={{primary: this.props.classes.link}}>
                            {I18n.t(`js.views.header.article.menu.add.${this.props.currentTopicMode}`)}
                        </ListItemText>
                    </ListItem>
                </List>
            </List>
        );
    }
}
