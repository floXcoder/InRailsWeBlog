import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import I18n from '@js/modules/translations';

import {
    fetchArticles,
    updateArticle
} from '@js/actions/articleActions';

import Loader from '@js/components/theme/loader';
import Table from '@js/components/theme/table';

class AdminArticles extends React.Component {
    static propTypes = {
        // from connect
        articles: PropTypes.array,
        isFetching: PropTypes.bool,
        fetchArticles: PropTypes.func,
        updateArticle: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchArticles({
            complete: true,
            order: 'visits_desc'
        }, {}, {}, {noCache: true});
    }

    _updateArticle = (newData) => {
        return this.props.updateArticle({
            id: newData.id,
            rank: newData['tracker.rank'],
            home_page: newData['tracker.homePage'] === 'true'
        });
    };

    render() {
        if (!this.props.articles || this.props.isFetching) {
            return (
                <div>
                    <h1 className="center-align">
                        {I18n.t('js.admin.articles.title')}
                    </h1>

                    <div className="center">
                        <Loader size="big"/>
                    </div>
                </div>
            );
        }

        return (
            <div>
                <h1 className="center-align">
                    {I18n.t('js.admin.articles.title')} ({this.props.articles.length})
                </h1>

                <Table title={I18n.t('js.admin.articles.table.title')}
                       isPaginated={true}
                       data={this.props.articles.map((article) => ({...article}))}
                       columns={[
                           {
                               name: I18n.t('js.admin.articles.table.columns.id'),
                               key: 'id',
                               hidden: true,
                               editable: false
                           },
                           {
                               name: I18n.t('js.admin.articles.table.columns.topic_id'),
                               key: 'topicId',
                               hidden: true,
                               editable: false
                           },
                           {
                               name: I18n.t('js.admin.articles.table.columns.mode'),
                               key: 'mode',
                               hidden: true,
                               lookup: {
                                   note: I18n.t('js.article.enums.mode.note'),
                                   story: I18n.t('js.article.enums.mode.story'),
                                   inventory: I18n.t('js.article.enums.mode.inventory'),
                                   link: I18n.t('js.article.enums.mode.link')
                               },
                               editable: false
                           },
                           {
                               name: I18n.t('js.admin.articles.table.columns.title'),
                               key: 'title',
                               editable: false
                           },
                           {
                               name: I18n.t('js.admin.articles.table.columns.priority'),
                               key: 'priority',
                               hidden: true,
                               editable: false
                           },
                           {
                               name: I18n.t('js.admin.articles.table.columns.visibility'),
                               key: 'visibility',
                               lookup: {
                                   everyone: I18n.t('js.article.enums.visibility.everyone'),
                                   only_me: I18n.t('js.article.enums.visibility.only_me')
                               },
                               editable: false
                           },
                           {
                               name: I18n.t('js.admin.articles.table.columns.date'),
                               key: 'dateShort',
                               filtering: false,
                               value: (article) => article.dateShort.slice().reverse().join(' '),
                               editable: false
                           },
                           {
                               name: I18n.t('js.admin.articles.table.columns.languages'),
                               key: 'languages',
                               value: (article) => article.languages.join(', '),
                               editable: false
                           },
                           {
                               name: I18n.t('js.admin.articles.table.columns.home_page'),
                               key: 'tracker.homePage',
                               lookup: {
                                   [true]: I18n.t('js.admin.articles.home_page.true'),
                                   [false]: I18n.t('js.admin.articles.home_page.false')
                               }
                           },
                           {
                               name: I18n.t('js.admin.articles.table.columns.popularity'),
                               key: 'tracker.popularity',
                               filtering: false,
                               editable: false
                           },
                           {
                               name: I18n.t('js.admin.articles.table.columns.rank'),
                               key: 'tracker.rank',
                               filtering: false
                           },
                           {
                               name: I18n.t('js.admin.articles.table.columns.visits_count'),
                               key: 'tracker.visitsCount',
                               filtering: false,
                               editable: false
                           },
                           {
                               name: I18n.t('js.admin.articles.table.columns.views_count'),
                               key: 'tracker.viewsCount',
                               filtering: false,
                               editable: false
                           },
                           {
                               name: I18n.t('js.admin.articles.table.columns.clicks_count'),
                               key: 'tracker.clicksCount',
                               filtering: false,
                               editable: false
                           },
                           {
                               name: I18n.t('js.admin.articles.table.columns.searches_count'),
                               key: 'tracker.searchesCount',
                               filtering: false,
                               editable: false
                           },
                           {
                               name: I18n.t('js.admin.articles.table.columns.comments_count'),
                               key: 'commentsCount',
                               filtering: false,
                               editable: false
                           }
                       ]}
                       editable={this._updateArticle}
                       actions={[
                           {
                               icon: 'open_in_new',
                               tooltip: I18n.t('js.admin.common.open_link'),
                               onClick: (event, article) => window.open(article.link, '_blank')
                           },
                           {
                               icon: 'visibility',
                               tooltip: I18n.t('js.admin.common.stats'),
                               onClick: (event, article) => window.open(article.link + '#tracking-article', '_blank')
                           }
                       ]}/>
            </div>
        );
    }
}

export default connect((state) => ({
    articles: state.articleState.articles,
    isFetching: state.articleState.isFetching
}), {
    fetchArticles,
    updateArticle
})(AdminArticles);