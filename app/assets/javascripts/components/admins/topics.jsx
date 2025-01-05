import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import I18n from '@js/modules/translations';

import {
    fetchTopics
} from '@js/actions/topicActions';

import Loader from '@js/components/theme/loader';
import Table from '@js/components/theme/table';


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
        this.props.fetchTopics(null, {
            order: 'created_desc',
            complete: true
        }, {}, {noCache: true});
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
                    {I18n.t('js.admin.topics.title')} ({this.props.topics.length})
                </h1>

                <Table title={I18n.t('js.admin.topics.table.title')}
                       isPaginated={true}
                       data={this.props.topics.map((topic) => ({...topic}))}
                       columns={[
                           {
                               name: I18n.t('js.admin.topics.table.columns.id'),
                               key: 'id',
                               hidden: true
                           },
                           {
                               name: I18n.t('js.admin.topics.table.columns.user_id'),
                               key: 'userId',
                               hidden: true
                           },
                           {
                               name: I18n.t('js.admin.topics.table.columns.mode'),
                               key: 'mode',
                               lookup: {
                                   default: I18n.t('js.topic.enums.mode.default'),
                                   stories: I18n.t('js.topic.enums.mode.stories'),
                                   inventories: I18n.t('js.topic.enums.mode.inventories')
                               },
                               width: 120
                           },
                           {
                               name: I18n.t('js.admin.topics.table.columns.name'),
                               key: 'name'
                           },
                           {
                               name: I18n.t('js.admin.topics.table.columns.priority'),
                               key: 'priority',
                               hidden: true
                           },
                           {
                               name: I18n.t('js.admin.topics.table.columns.visibility'),
                               key: 'visibility',
                               lookup: {
                                   everyone: I18n.t('js.topic.enums.visibility.everyone'),
                                   only_me: I18n.t('js.topic.enums.visibility.everyone')
                               }
                           },
                           {
                               name: I18n.t('js.admin.topics.table.columns.languages'),
                               key: 'languages',
                               value: (topic) => topic.languages.join(', '),
                               width: 120
                           },
                           {
                               name: I18n.t('js.admin.topics.table.columns.articles_count'),
                               key: 'articlesCount',
                               filtering: false
                           },
                           {
                               name: I18n.t('js.admin.topics.table.columns.visits_count'),
                               key: 'tracker.visitsCount',
                               filtering: false
                           },
                           {
                               name: I18n.t('js.admin.topics.table.columns.clicks_count'),
                               key: 'tracker.clicksCount',
                               filtering: false
                           },
                           {
                               name: I18n.t('js.admin.topics.table.columns.searches_count'),
                               key: 'tracker.searchesCount',
                               filtering: false
                           },
                           {
                               name: I18n.t('js.admin.topics.table.columns.created_at'),
                               key: 'createdAt',
                               filtering: false
                           }
                       ]}
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

export default connect((state) => ({
    topics: state.topicState.topics,
    isFetching: state.topicState.isFetching
}), {
    fetchTopics
})(AdminTopics);