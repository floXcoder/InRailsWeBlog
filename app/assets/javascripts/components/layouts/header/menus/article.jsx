import PropTypes from 'prop-types';

import {
    Link
} from 'react-router';

import classNames from 'classnames';

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import EditIcon from '@mui/icons-material/Edit';
import AssignmentIcon from '@mui/icons-material/Assignment';

import I18n from '@js/modules/translations';

import {
    newArticlePath
} from '@js/constants/routesHelper';


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
                        <ListItemButton component={Link}
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
                        </ListItemButton>

                        <Divider/>
                    </>
                }

                <ListItemButton component={Link}
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
                </ListItemButton>
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
