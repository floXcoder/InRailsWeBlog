'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
    fetchArticles
} from '../../actions';

import Loader from '../theme/loader';
import Table from '../theme/table';

export default @connect((state) => ({
    articles: state.articleState.articles
}), {
    fetchArticles
})
@hot
class AdminArticles extends React.Component {
    static propTypes = {
        // from connect
        articles: PropTypes.array,
        fetchArticles: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchArticles({complete: true});
    }

    render() {
        if (!this.props.articles || this.props.articles.length === 0) {
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
                               hidden: true
                           },
                           {
                               title: I18n.t('js.admin.articles.table.columns.topic_id'),
                               field: 'topicId',
                               hidden: true
                           },
                           {
                               title: I18n.t('js.admin.articles.table.columns.mode'),
                               field: 'mode',
                               lookup: {
                                   'note': I18n.t('js.article.enums.mode.note'),
                                   'story': I18n.t('js.article.enums.mode.story'),
                                   'inventory': I18n.t('js.article.enums.mode.inventory'),
                                   'link': I18n.t('js.article.enums.mode.link')
                               }
                           },
                           {
                               title: I18n.t('js.admin.articles.table.columns.title'),
                               field: 'title',
                           },
                           {
                               title: I18n.t('js.admin.articles.table.columns.priority'),
                               field: 'priority',
                               hidden: true
                           },
                           {
                               title: I18n.t('js.admin.articles.table.columns.visibility'),
                               field: 'visibility',
                               lookup: {
                                   'everyone': I18n.t('js.article.enums.visibility.everyone'),
                                   'only_me': I18n.t('js.article.enums.visibility.only_me')
                               }
                           },
                           {
                               title: I18n.t('js.admin.articles.table.columns.views_count'),
                               field: 'tracker[viewsCount]',
                               filtering: false
                           },
                           {
                               title: I18n.t('js.admin.articles.table.columns.clicks_count'),
                               field: 'tracker[clicksCount]',
                               filtering: false
                           },
                           {
                               title: I18n.t('js.admin.articles.table.columns.searches_count'),
                               field: 'tracker[searchesCount]',
                               filtering: false
                           },
                           {
                               title: I18n.t('js.admin.articles.table.columns.comments_count'),
                               field: 'commentsCount',
                               filtering: false
                           },
                           {
                               title: I18n.t('js.admin.articles.table.columns.date'),
                               field: 'date',
                               filtering: false
                           }
                       ]}
                       options={{
                           columnsButton: true,
                           exportButton: true,
                           filtering: true,
                           actionsColumnIndex: -1,
                           pageSize: 50,
                           pageSizeOptions: [50, 100, 200],
                           emptyRowsWhenPaging: false
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

