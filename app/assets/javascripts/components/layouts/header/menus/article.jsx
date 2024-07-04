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


const HeaderArticleMenu = function ({
                                        routeParams,
                                        currentTagSlugs,
                                        hasTemporaryArticle,
                                        userSlug,
                                        topicSlug,
                                        currentTopicMode,
                                        isNested = false,
                                        onItemClick
                                    }) {
    const parentTagSlug = routeParams.parentTagSlug || routeParams.tagSlug || currentTagSlugs[0];
    const childTagSlug = routeParams.childTagSlug || currentTagSlugs[1];

    return (
        <List className={classNames({
            'layout-header-nested-menu': isNested
        })}
              component="div"
              disablePadding={isNested}>
            <List component="div">
                {
                    !!hasTemporaryArticle &&
                    <>
                        <ListItem button={true}
                                  component={Link}
                                  className="layout-header-link"
                                  to={{
                                      pathname: newArticlePath(userSlug, topicSlug)
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
                              pathname: newArticlePath(userSlug, topicSlug)
                          }}
                          state={{
                              parentTagSlug: parentTagSlug,
                              childTagSlug: childTagSlug
                          }}
                          onClick={onItemClick}>
                    <ListItemIcon>
                        <AssignmentIcon/>
                    </ListItemIcon>

                    <ListItemText classes={{primary: 'layout-header-link'}}>
                        {I18n.t(`js.views.header.article.menu.add.${currentTopicMode}`)}
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

export default HeaderArticleMenu;
