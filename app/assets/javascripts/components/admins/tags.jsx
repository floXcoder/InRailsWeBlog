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
                       locale={I18n.locale}
                       data={this.props.tags.map((tag) => ({...tag}))}
                       columns={[
                           {
                               title: I18n.t('js.admin.tags.table.columns.id'),
                               field: 'id',
                               hidden: true
                           },
                           {
                               title: I18n.t('js.admin.tags.table.columns.name'),
                               field: 'name'
                           },
                           {
                               title: I18n.t('js.admin.tags.table.columns.description'),
                               field: 'description',
                               hidden: true
                           },
                           {
                               title: I18n.t('js.admin.tags.table.columns.synonyms'),
                               field: 'synonyms',
                               hidden: true
                           },
                           {
                               title: I18n.t('js.admin.tags.table.columns.priority'),
                               field: 'priority',
                               hidden: true
                           },
                           {
                               title: I18n.t('js.admin.tags.table.columns.visibility'),
                               field: 'visibility',
                               lookup: {
                                   everyone: I18n.t('js.tag.enums.visibility.everyone'),
                                   only_me: I18n.t('js.tag.enums.visibility.only_me')
                               },
                               width: 120
                           },
                           {
                               title: I18n.t('js.admin.tags.table.columns.tagged_articles_count'),
                               field: 'taggedArticlesCount',
                               filtering: false
                           },
                           {
                               title: I18n.t('js.admin.tags.table.columns.visits_count'),
                               field: 'tracker[visitsCount]',
                               filtering: false
                           },
                           {
                               title: I18n.t('js.admin.tags.table.columns.clicks_count'),
                               field: 'tracker[clicksCount]',
                               filtering: false
                           },
                           {
                               title: I18n.t('js.admin.tags.table.columns.searches_count'),
                               field: 'tracker[searchesCount]',
                               filtering: false
                           },
                           {
                               title: I18n.t('js.admin.tags.table.columns.date'),
                               field: 'date',
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