'use strict';

import {
    Link
} from 'react-router-dom';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import EditIcon from '@mui/icons-material/Edit';
import AssignmentIcon from '@mui/icons-material/Assignment';

import {
    newArticlePath
} from '../../../../constants/routesHelper';


const HeaderArticleMenu = function (props) {
    const parentTagSlug = props.routeParams.parentTagSlug || props.routeParams.tagSlug || props.currentTagSlugs[0];
    const childTagSlug = props.routeParams.childTagSlug || props.currentTagSlugs[1];

    return (
        <List className={classNames({
            'layout-header-nested-menu': props.isNested
        })}
              component="div"
              disablePadding={props.isNested}>
            <List component="div">
                {
                    !!props.hasTemporaryArticle &&
                    <>
                        <ListItem button={true}
                                  component={Link}
                                  className="layout-header-link"
                                  to={{
                                      pathname: newArticlePath(props.userSlug, props.topicSlug)
                                  }}
                                  state={{
                                      temporary: true
                                  }}>
                            <ListItemIcon>
                                <EditIcon/>
                            </ListItemIcon>

                            <ListItemText classes={{primary: 'layout-header-link'}}>
                                {I18n.t('js.views.header.article.menu.temporary')}
                            </ListItemText>
                        </ListItem>

                        <Divider/>
                    </>
                }

                <ListItem button={true}
                          component={Link}
                          className="layout-header-link"
                          to={{
                              pathname: newArticlePath(props.userSlug, props.topicSlug)
                          }}
                          state={{
                              parentTagSlug: parentTagSlug,
                              childTagSlug: childTagSlug
                          }}
                          onClick={props.onItemClick}>
                    <ListItemIcon>
                        <AssignmentIcon/>
                    </ListItemIcon>

                    <ListItemText classes={{primary: 'layout-header-link'}}>
                        {I18n.t(`js.views.header.article.menu.add.${props.currentTopicMode}`)}
                    </ListItemText>
                </ListItem>
            </List>
        </List>
    );
};

HeaderArticleMenu.propTypes = {
    routeParams: PropTypes.object.isRequired,
    userSlug: PropTypes.string.isRequired,
    currentTagSlugs: PropTypes.array.isRequired,
    hasTemporaryArticle: PropTypes.bool.isRequired,
    currentTopicMode: PropTypes.string,
    topicSlug: PropTypes.string,
    isNested: PropTypes.bool,
    onItemClick: PropTypes.func
};

HeaderArticleMenu.defaultProps = {
    isNested: false
};

export default HeaderArticleMenu;
