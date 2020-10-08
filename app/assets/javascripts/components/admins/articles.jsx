'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
    fetchArticles,
    updateArticle
} from '../../actions';

import Loader from '../theme/loader';
import Table from '../theme/table';

export default @connect((state) => ({
    articles: state.articleState.articles,
    isFetching: state.articleState.isFetching
}), {
    fetchArticles,
    updateArticle
})
@hot
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
        this.props.fetchArticles({complete: true});
    }

    _updateArticle =  (newData, oldData) => {
        return this.props.updateArticle({
            id: oldData.id,
            rank: newData.tracker.rank,
            home_page: newData.tracker.homePage == 'true'
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
                    {I18n.t('js.admin.articles.title')}
                </h1>

                <Table title={I18n.t('js.admin.articles.table.title')}
                       locale={I18n.locale}
                       data={this.props.articles.map((article) => Object.assign({}, article))}
                       columns={[
                           {
                               title: I18n.t('js.admin.articles.table.columns.id'),
                               field: 'id',
                               hidden: true,
                               editable: 'onUpdate'
                           },
                           {
                               title: I18n.t('js.admin.articles.table.columns.topic_id'),
                               field: 'topicId',
                               hidden: true,
                               editable: 'never'
                           },
                           {
                               title: I18n.t('js.admin.articles.table.columns.mode'),
                               field: 'mode',
                               hidden: true,
                               lookup: {
                                   'note': I18n.t('js.article.enums.mode.note'),
                                   'story': I18n.t('js.article.enums.mode.story'),
                                   'inventory': I18n.t('js.article.enums.mode.inventory'),
                                   'link': I18n.t('js.article.enums.mode.link')
                               },
                               editable: 'never'
                           },
                           {
                               title: I18n.t('js.admin.articles.table.columns.title'),
                               field: 'title',
                               editable: 'never'
                           },
                           {
                               title: I18n.t('js.admin.articles.table.columns.priority'),
                               field: 'priority',
                               hidden: true,
                               editable: 'never'
                           },
                           {
                               title: I18n.t('js.admin.articles.table.columns.visibility'),
                               field: 'visibility',
                               lookup: {
                                   'everyone': I18n.t('js.article.enums.visibility.everyone'),
                                   'only_me': I18n.t('js.article.enums.visibility.only_me')
                               },
                               editable: 'never'
                           },
                           {
                               title: I18n.t('js.admin.articles.table.columns.date'),
                               field: 'dateShort',
                               filtering: false,
                               render: (article) => article.dateShort.slice().reverse().join(' '),
                               editable: 'never'
                           },
                           {
                               title: I18n.t('js.admin.articles.table.columns.languages'),
                               field: 'languages',
                               render: (article) => article.languages.join(', '),
                               editable: 'never'
                           },
                           {
                               title: I18n.t('js.admin.articles.table.columns.home_page'),
                               field: 'tracker[homePage]',
                               lookup: {
                                   [true]: I18n.t('js.admin.articles.home_page.true'),
                                   [false]: I18n.t('js.admin.articles.home_page.false')
                               }
                           },
                           {
                               title: I18n.t('js.admin.articles.table.columns.popularity'),
                               field: 'tracker[popularity]',
                               filtering: false,
                               editable: 'never'
                           },
                           {
                               title: I18n.t('js.admin.articles.table.columns.rank'),
                               field: 'tracker[rank]',
                               filtering: false
                           },
                           {
                               title: I18n.t('js.admin.articles.table.columns.views_count'),
                               field: 'tracker[viewsCount]',
                               filtering: false,
                               editable: 'never'
                           },
                           {
                               title: I18n.t('js.admin.articles.table.columns.clicks_count'),
                               field: 'tracker[clicksCount]',
                               filtering: false,
                               editable: 'never'
                           },
                           {
                               title: I18n.t('js.admin.articles.table.columns.searches_count'),
                               field: 'tracker[searchesCount]',
                               filtering: false,
                               editable: 'never'
                           },
                           {
                               title: I18n.t('js.admin.articles.table.columns.comments_count'),
                               field: 'commentsCount',
                               filtering: false,
                               editable: 'never'
                           },
                       ]}
                       options={{
                           columnsButton: true,
                           exportButton: true,
                           filtering: true,
                           actionsColumnIndex: -1,
                           pageSize: 100,
                           pageSizeOptions: [100, 500, 1000],
                           emptyRowsWhenPaging: false
                       }}
                       editable={{
                           onRowUpdate: this._updateArticle
                       }}
                       actions={[
                           {
                               icon: 'open_in_new',
                               tooltip: I18n.t('js.admin.common.open_link'),
                               onClick: (event, article) => window.open(article.link, '_blank')
                           }
                       ]}/>
            </div>
        );
    }
}

