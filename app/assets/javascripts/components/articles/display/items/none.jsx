'use strict';

import {
    Link
} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import {
    newArticlePath
} from '../../../../constants/routesHelper';

const ArticleNoneDisplay = ({userSlug, topicSlug, tagSlug, childTagSlug, isTopicPage, isSearchPage}) => (
    <div className="row margin-top-30">
        <div className="col m6 offset-m3 s10 offset-s1">
            <Paper style={{
                padding: '.6rem'
            }}
                   elevation={4}>
                <h2 className="center-align"
                    style={{
                        fontSize: '1.8rem',
                        marginTop: '1rem'
                    }}>
                    {
                        isSearchPage &&
                        I18n.t('js.article.common.no_results.search.title')
                    }

                    {
                        isTopicPage && (
                            childTagSlug
                                ?
                                I18n.t('js.article.common.no_results.topic.title.child_tag')
                                :
                                (
                                    tagSlug
                                        ?
                                        I18n.t('js.article.common.no_results.topic.title.tag')
                                        :
                                        I18n.t('js.article.common.no_results.topic.title.default')
                                )
                        )
                    }
                </h2>

                {
                    isSearchPage &&
                    <p>

                        {I18n.t('js.article.common.no_results.search.content')}
                    </p>
                }

                {
                    isTopicPage &&
                    <p className="center-align">
                        <Button className="margin-top-20"
                                color="primary"
                                variant="outlined"
                                size="small"
                                component={Link}
                                to={newArticlePath(userSlug, topicSlug)}>
                            {I18n.t('js.article.common.no_results.topic.button')}
                        </Button>
                    </p>
                }
            </Paper>
        </div>
    </div>
);

ArticleNoneDisplay.propTypes = {
    userSlug: PropTypes.string,
    topicSlug: PropTypes.string,
    tagSlug: PropTypes.string,
    childTagSlug: PropTypes.string,
    isSearchPage: PropTypes.bool,
    isTopicPage: PropTypes.bool
};

ArticleNoneDisplay.defaultProps = {
    isSearchPage: true,
    isTopicPage: false
};

export default React.memo(ArticleNoneDisplay);
