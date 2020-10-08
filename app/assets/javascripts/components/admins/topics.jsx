'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
    fetchTopics
} from '../../actions';

import Loader from '../theme/loader';
import Table from '../theme/table';

export default @connect((state) => ({
    topics: state.topicState.topics,
    isFetching: state.topicState.isFetching
}), {
    fetchTopics
})
@hot
class AdminTopics extends React.Component {
    static propTypes = {
        // from connect
        topics: PropTypes.array,
        isFetching: PropTypes.bool,
        fetchTopics: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchTopics(null, {complete: true});
    }

    render() {
        if (!this.props.topics || this.props.isFetching) {
            return (
                <div>
                    <h1 className="center-align">
                        {I18n.t('js.admin.topics.title')}
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
                    {I18n.t('js.admin.topics.title')}
                </h1>

                <Table title={I18n.t('js.admin.topics.table.title')}
                       locale={I18n.locale}
                       data={this.props.topics.map((topic) => Object.assign({}, topic))}
                       columns={[
                           {
                               title: I18n.t('js.admin.topics.table.columns.id'),
                               field: 'id',
                               hidden: true
                           },
                           {
                               title: I18n.t('js.admin.topics.table.columns.user_id'),
                               field: 'userId',
                               hidden: true
                           },
                           {
                               title: I18n.t('js.admin.topics.table.columns.mode'),
                               field: 'mode',
                               lookup: {
                                   'default': I18n.t('js.topic.enums.mode.default'),
                                   'stories': I18n.t('js.topic.enums.mode.stories'),
                                   'inventories': I18n.t('js.topic.enums.mode.inventories')
                               },
                               width: 120
                           },
                           {
                               title: I18n.t('js.admin.topics.table.columns.name'),
                               field: 'name',
                           },
                           {
                               title: I18n.t('js.admin.topics.table.columns.priority'),
                               field: 'priority',
                               hidden: true
                           },
                           {
                               title: I18n.t('js.admin.topics.table.columns.visibility'),
                               field: 'visibility',
                               lookup: {
                                   'everyone': I18n.t('js.topic.enums.visibility.everyone'),
                                   'only_me': I18n.t('js.topic.enums.visibility.everyone')
                               }
                           },
                           {
                               title: I18n.t('js.admin.topics.table.columns.languages'),
                               field: 'languages',
                               render: (topic) => topic.languages.join(', '),
                               width: 100
                           },
                           {
                               title: I18n.t('js.admin.topics.table.columns.articles_count'),
                               field: 'articlesCount',
                               filtering: false
                           },
                           {
                               title: I18n.t('js.admin.topics.table.columns.clicks_count'),
                               field: 'tracker[clicksCount]',
                               filtering: false
                           },
                           {
                               title: I18n.t('js.admin.topics.table.columns.searches_count'),
                               field: 'tracker[searchesCount]',
                               filtering: false
                           },
                           {
                               title: I18n.t('js.admin.topics.table.columns.created_at'),
                               field: 'createdAt',
                               filtering: false
                           }
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
                       actions={[
                           {
                               icon: 'open_in_new',
                               tooltip: I18n.t('js.admin.common.open_link'),
                               onClick: (event, topic) => window.open(topic.link, '_blank')
                           }
                       ]}/>
            </div>
        );
    }
}

