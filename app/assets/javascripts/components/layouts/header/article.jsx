'use strict';

import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';

import AddCircleIcon from '@mui/icons-material/AddCircle';

import Dropdown from '../../theme/dropdown';

import HeaderArticleMenu from './menus/article';


const HomeArticleHeader = function ({
                                        routeParams,
                                        userSlug,
                                        currentTagSlugs,
                                        currentTopicMode,
                                        topicSlug,
                                        hasTemporaryArticle
                                    }) {
    return (
        <Dropdown id="header-article"
                  buttonClassName="layout-header-headerButton"
                  button={
                      <IconButton color="default" itemProp="url" size="large">
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

HomeArticleHeader.defaultProps = {
    hasTemporaryArticle: false
};

export default React.memo(HomeArticleHeader);
