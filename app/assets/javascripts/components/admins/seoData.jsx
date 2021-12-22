'use strict';

import {
    hot
} from 'react-hot-loader/root';

import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import {
    fetchSeoData,
    retrieveParametersSeoData,
    addSeoData,
    updateSeoData,
    deleteSeoData
} from '../../actions/admin';

import Table from '../theme/table';
import Loader from '../theme/loader';

import AdminSeoDataForm from './seo/form';


export default @connect((state) => ({
    seoData: state.adminState.seoData,
    isFetching: state.adminState.isFetching
}), {
    fetchSeoData,
    retrieveParametersSeoData,
    addSeoData,
    updateSeoData,
    deleteSeoData
})
@hot
class AdminSeoData extends React.Component {
    static propTypes = {
        seoPages: PropTypes.array.isRequired,
        // from connect
        seoData: PropTypes.array,
        isFetching: PropTypes.bool,
        fetchSeoData: PropTypes.func,
        retrieveParametersSeoData: PropTypes.func,
        addSeoData: PropTypes.func,
        updateSeoData: PropTypes.func,
        deleteSeoData: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    state = {
        isAddingSeoData: false,
        editingSeoData: undefined,
        isNew: true
    };

    componentDidMount() {
        this.props.fetchSeoData();
    }

    _handleAddSeoData = (isNew, event) => {
        event.preventDefault();

        this.setState({
            isAddingSeoData: true,
            isNew
        });
    };

    _handleEditSeoData = (event, seoData) => {
        event.preventDefault();

        this.setState({
            editingSeoData: seoData,
            isNew: false
        });
    };

    _handlePersistSeoData = (isNew, seoData, data) => {
        if (isNew) {
            this.props.addSeoData(data)
                .then(() => {
                    this.setState({
                        isAddingSeoData: false,
                        editingSeoData: undefined
                    });
                });
        } else {
            this.props.updateSeoData(seoData.id, data)
                .then(() => {
                    this.setState({
                        isAddingSeoData: false,
                        editingSeoData: undefined
                    });
                });
        }
    };

    _handleDeleteSeoData = (event, seoData) => {
        const validation = window.confirm(I18n.t('js.admin.seo.form.delete_confirmation', {name: seoData.name}));
        if (validation) {
            this.props.deleteSeoData(seoData.id)
                .then(() => {
                    this.setState({
                        isAddingSeoData: false,
                        editingSeoData: undefined
                    });
                });
        }
    };

    _handleCancel = (event) => {
        event.preventDefault();

        this.setState({
            editingSeoData: undefined,
            isAddingSeoData: false
        });
    };

    render() {
        if (!this.props.seoData || this.props.isFetching) {
            return (
                <div>
                    <h1 className="center-align">
                        {I18n.t('js.admin.seo.title')}
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
                    {I18n.t('js.admin.seo.title')}
                </h1>

                <div className="center-align">
                    <Button color="primary"
                            variant="contained"
                            onClick={this._handleAddSeoData.bind(this, true)}>
                        {I18n.t('js.admin.seo.add')}
                    </Button>
                </div>

                {
                    (this.state.isAddingSeoData || this.state.editingSeoData) &&
                    <Paper className="margin-top-30 margin-bottom-40"
                           elevation={1}>
                        <AdminSeoDataForm seoPages={this.props.seoPages}
                                          seoPagesUsed={this.props.seoData?.map((seoData) => seoData.name)}
                                          retrieveParameters={this.props.retrieveParametersSeoData}
                                          isNew={this.state.isNew}
                                          seoData={this.state.editingSeoData}
                                          onPersistSeoData={this._handlePersistSeoData}
                                          onCancel={this._handleCancel}/>
                    </Paper>
                }

                <Table title={I18n.t('js.admin.seo.table.title')}
                       locale={I18n.locale}
                       data={this.props.seoData.map((seoData) => ({...seoData}))}
                       columns={[
                           {
                               title: I18n.t('js.admin.seo.table.columns.id'),
                               field: 'id',
                               hidden: true
                           },
                           {
                               title: I18n.t('js.admin.seo.table.columns.name'),
                               field: 'name'
                           },
                           {
                               title: I18n.t('js.admin.seo.table.columns.visibility'),
                               field: 'visibility',
                               lookup: {
                                   [true]: I18n.t('js.admin.seo.visibility.public'),
                                   [false]: I18n.t('js.admin.seo.visibility.private')
                               },
                               width: 140
                           },
                           {
                               title: I18n.t('js.admin.seo.table.columns.locale'),
                               field: 'locale',
                               width: 80
                           },
                           {
                               title: I18n.t('js.admin.seo.table.columns.parameters'),
                               field: 'parameters',
                               render: (seoData) => seoData.parameters.join(', ')
                           },
                           {
                               title: I18n.t('js.admin.seo.table.columns.page_title'),
                               field: 'pageTitle'
                           },
                           {
                               title: I18n.t('js.admin.seo.table.columns.meta_desc'),
                               field: 'metaDesc'
                           }
                       ]}
                       options={{
                           columnsButton: true,
                           exportButton: true,
                           filtering: true,
                           actionsColumnIndex: -1,
                           paging: false,
                           emptyRowsWhenPaging: false
                       }}
                       actions={[
                           {
                               icon: 'edit',
                               tooltip: I18n.t('js.admin.seo.form.update'),
                               onClick: this._handleEditSeoData
                           },
                           {
                               icon: 'delete',
                               tooltip: I18n.t('js.admin.seo.form.delete'),
                               onClick: this._handleDeleteSeoData,
                               iconProps: {
                                   style: {
                                       fontSize: 20
                                   }
                               }
                           }
                       ]}/>
            </div>
        );
    }
}
