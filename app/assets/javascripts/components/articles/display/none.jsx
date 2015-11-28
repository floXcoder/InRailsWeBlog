'use strict';

var ArticleNone = React.createClass({
    render () {
        return (
            <div className="row">
                <div className="col s6 offset-s3">
                    <div className="card blue-grey darken-1">
                        <div className="card-content white-text">
                                <span className="card-title">
                                    {I18n.t('js.article.search.no_results.title')}
                                </span>

                            <p>
                                {I18n.t('js.article.search.no_results.content')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = ArticleNone;
