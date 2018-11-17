'use strict';

import {
    Link
} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const ArticleNoneDisplay = ({userSlug, topicSlug, isTopicPage, isSearchPage}) => (
    <div className="row margin-top-30">
        <div className="col s6 offset-s3">
            <Paper style={{
                padding: '.6rem'
            }}
                   elevation={4}>
                <h2 className="center-align"
                    style={{
                        marginTop: '1rem'
                    }}>
                    {
                        isSearchPage &&
                        I18n.t('js.article.common.no_results.search.title')
                    }

                    {
                        isTopicPage &&
                        I18n.t('js.article.common.no_results.topic.title')
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
                                to={`/users/${userSlug}/topics/${topicSlug}/article-new`}>
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
    isSearchPage: PropTypes.bool,
    isTopicPage: PropTypes.bool
};

ArticleNoneDisplay.defaultProps = {
    isSearchPage: true,
    isTopicPage: false
};

export default React.memo(ArticleNoneDisplay);
