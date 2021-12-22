'use strict';

import {
    Link
} from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import {
    newArticlePath
} from '../../../../constants/routesHelper';

const ArticleNoneDisplay = ({
                                userSlug,
                                topicSlug,
                                tagSlug,
                                childTagSlug,
                                alternativeUrl,
                                isConnected,
                                isTopicPage,
                                isSearchPage
                            }) => (
    <div className="row margin-top-30">
        <div className="col m8 offset-m2 s10 offset-s1">
            <Paper style={{
                padding: '.6rem'
            }}
                   elevation={4}>
                <h1 className="center-align"
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
                </h1>

                {
                    alternativeUrl?.link &&
                    <p>
                        {I18n.t('js.article.common.no_results.alternative_url')}
                        <a href={alternativeUrl.link}>
                            {alternativeUrl.language}
                        </a>
                    </p>
                }

                {
                    isSearchPage &&
                    <p>

                        {I18n.t('js.article.common.no_results.search.content')}
                    </p>
                }

                {
                    (isConnected && isTopicPage) &&
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
    alternativeUrl: PropTypes.object,
    isSearchPage: PropTypes.bool,
    isConnected: PropTypes.bool,
    isTopicPage: PropTypes.bool
};

ArticleNoneDisplay.defaultProps = {
    isSearchPage: true,
    isConnected: false,
    isTopicPage: false
};

export default React.memo(ArticleNoneDisplay);
