'use strict';

import {
    hot
} from 'react-hot-loader/root';

import {
    fetchTags
} from '../../actions';

import {
    getTags
} from '../../selectors';

import Loader from '../theme/loader';
import Table from '../theme/table';

export default @connect((state) => ({
    tags: getTags(state)
}), {
    fetchTags
})
@hot
class AdminTags extends React.Component {
    static propTypes = {
        // from connect
        tags: PropTypes.array,
        fetchTags: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.fetchTags({complete: true});
    }

    render() {
        if (!this.props.tags || this.props.tags.length === 0) {
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
                    {I18n.t('js.admin.tags.title')}
                </h1>

                <Table title={I18n.t('js.admin.tags.table.title')}
                       data={this.props.tags}
                       columns={[
                           {
                               title: I18n.t('js.admin.tags.table.columns.id'),
                               field: 'id',
                               hidden: true
                           },
                           {
                               title: I18n.t('js.admin.tags.table.columns.name'),
                               field: 'name',
                           },
                           {
                               title: I18n.t('js.admin.tags.table.columns.description'),
                               field: 'description',
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
                                   'everyone': I18n.t('js.tag.enums.visibility.everyone'),
                                   'only_me': I18n.t('js.tag.enums.visibility.only_me')
                               }
                           },
                           {
                               title: I18n.t('js.admin.tags.table.columns.tagged_articles_count'),
                               field: 'taggedArticlesCount',
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
                               onClick: (event, tag) => window.open(tag.link, '_blank')
                           }
                       ]}/>
            </div>
        );
    }
}

