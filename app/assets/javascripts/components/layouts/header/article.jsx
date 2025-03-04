import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';

import AddCircleIcon from '@mui/icons-material/AddCircle';

import Dropdown from '@js/components/theme/dropdown';

import HeaderArticleMenu from '@js/components/layouts/header/menus/article';


const HomeArticleHeader = function ({
                                        routeParams,
                                        userSlug,
                                        currentTagSlugs,
                                        currentTopicMode,
                                        topicSlug,
                                        hasTemporaryArticle = false
                                    }) {
    return (
        <Dropdown id="header-article"
                  buttonClassName="layout-header-headerButton"
                  button={
                      <IconButton color="default"
                                  itemProp="url"
                                  size="large">
                          {
                              hasTemporaryArticle
                                  ?
                                  <Badge badgeContent="1"
                                         color="secondary">
                                      <AddCircleIcon/>
                                  </Badge>
                                  :
                                  <AddCircleIcon color="secondary"/>
                          }
                      </IconButton>
                  }>
            <HeaderArticleMenu routeParams={routeParams}
                               userSlug={userSlug}
                               currentTopicMode={currentTopicMode}
                               currentTagSlugs={currentTagSlugs}
                               topicSlug={topicSlug}
                               hasTemporaryArticle={hasTemporaryArticle}/>
        </Dropdown>
    );
};

HomeArticleHeader.propTypes = {
    routeParams: PropTypes.object.isRequired,
    userSlug: PropTypes.string.isRequired,
    currentTagSlugs: PropTypes.array.isRequired,
    currentTopicMode: PropTypes.string,
    topicSlug: PropTypes.string,
    hasTemporaryArticle: PropTypes.bool
};

export default React.memo(HomeArticleHeader);
