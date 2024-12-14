import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import I18n from '@js/modules/translations';

import {
    fetchTags
} from '@js/actions/tagActions';

import Loader from '@js/components/theme/loader';
import Table from '@js/components/theme/table';


class AdminTags extends React.Component {
    static propTypes = {
        // from connect
        tags: PropTypes.array,
        isFetching: PropTypes.bool,
        fetchTags: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchTags({order: 'created_desc', complete: true}, {}, {}, {noCache: true});
    }

    render() {
        if (!this.props.tags || this.props.isFetching) {
            return (
                <div>
                    <h1 className="center-align">
                        {I18n.t('js.admin.tags.title')}
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
                    {I18n.t('js.admin.tags.title')} ({this.props.tags.length})
                </h1>

                <Table title={I18n.t('js.admin.tags.table.title')}
                       isPaginated={true}
                       data={this.props.tags.map((tag) => ({...tag}))}
                       columns={[
                           {
                               name: I18n.t('js.admin.tags.table.columns.id'),
                               key: 'id',
                               hidden: true
                           },
                           {
                               name: I18n.t('js.admin.tags.table.columns.name'),
                               key: 'name'
                           },
                           {
                               name: I18n.t('js.admin.tags.table.columns.description'),
                               key: 'description',
                               hidden: true
                           },
                           {
                               name: I18n.t('js.admin.tags.table.columns.synonyms'),
                               key: 'synonyms',
                               hidden: true
                           },
                           {
                               name: I18n.t('js.admin.tags.table.columns.priority'),
                               key: 'priority',
                               hidden: true
                           },
                           {
                               name: I18n.t('js.admin.tags.table.columns.visibility'),
                               key: 'visibility',
                               lookup: {
                                   everyone: I18n.t('js.tag.enums.visibility.everyone'),
                                   only_me: I18n.t('js.tag.enums.visibility.only_me')
                               },
                               width: 120
                           },
                           {
                               name: I18n.t('js.admin.tags.table.columns.tagged_articles_count'),
                               key: 'taggedArticlesCount',
                               filtering: false
                           },
                           {
                               name: I18n.t('js.admin.tags.table.columns.visits_count'),
                               key: 'tracker.visitsCount',
                               filtering: false
                           },
                           {
                               name: I18n.t('js.admin.tags.table.columns.clicks_count'),
                               key: 'tracker.clicksCount',
                               filtering: false
                           },
                           {
                               name: I18n.t('js.admin.tags.table.columns.searches_count'),
                               key: 'tracker.searchesCount',
                               filtering: false
                           },
                           {
                               name: I18n.t('js.admin.tags.table.columns.date'),
                               key: 'date',
                               filtering: false
                           }
                       ]}
                       actions={[
                           {
                               icon: 'open_in_new',
                               tooltip: I18n.t('js.admin.common.open_link'),
                               onClick: (event, tag) => window.open(tag.link, '_blank')
                           }
                       ]}/>
            </div>
        );
    }
}

export default connect((state) => ({
    tags: state.tagState.tags,
    isFetching: state.tagState.isFetching
}), {
    fetchTags
})(AdminTags)