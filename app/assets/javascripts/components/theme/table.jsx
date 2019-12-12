'use strict';

import Paper from '@material-ui/core/Paper';

import MaterialTable from 'material-table';

import {
    CsvBuilder
} from 'filefy';

const Localizations = {
    fr: {
        pagination: {
            labelDisplayedRows: '{from}-{to} sur {count}', // {from}-{to} of {count}
            labelRowsPerPage: 'Colonnes par page :', // Rows per page:
            labelRowsSelect: 'colonnes',
            firstAriaLabel: 'Première page', // First Page
            firstTooltip: 'Première page', // First Page
            previousAriaLabel: 'Page précédente', // Previous Page
            previousTooltip: 'Page précédente', // Previous Page
            nextAriaLabel: 'Page suivante', // Next Page
            nextTooltip: 'Page suivante', // Next Page
            lastAriaLabel: 'Dernière page', // Last Page
            lastTooltip: 'Dernière page' // Last Page
        },
        toolbar: {
            addRemoveColumns: 'Ajouter ou supprimer colonnes',
            nRowsSelected: '{0} colonne(s) sélectionnées', // {0} row(s) selected
            showColumnsTitle: 'Afficher les colonnes', // Show Columns
            showColumnsAriaLabel: 'Afficher les colonnes', // Show Columns
            exportTitle: 'Exporter', // Export
            exportAriaLabel: 'Exporter', // Export
            exportName: 'Exporter en CSV', // Export as CSV
            searchTooltip: 'Rechercher', // Search
            searchPlaceholder: 'Rechercher' // Search
        },
        header: {
            actions: 'Actions' // Actions
        },
        grouping: {
            groupedBy: 'Grouper par',
            placeholder: 'Déplacer l\'en-tête ici pour regrouper par'
        },
        body: {
            emptyDataSourceMessage: 'Pas de données à afficher', // No records to display
            filterRow: {
                filterTooltip: 'Filtrer' // Filter
            },
            editRow: {
                saveTooltip: 'Enregistrer',
                cancelTooltip: 'Annuler',
                deleteText: 'Êtes-vous sûr de supprimer cette colonne ?'
            },
            addTooltip: 'Ajouter',
            deleteTooltip: 'Supprimer',
            editTooltip: 'Modifier'
        }
    }
};

const byString = (o, s) => {
    if (!s) {
        return;
    }

    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var x = a[i];
        if (o && x in o) {
            o = o[x];
        } else {
            return;
        }
    }
    return o;
};

const getFieldValue = (rowData, columnDef, lookup = true) => {
    let value = (typeof rowData[columnDef.field] !== 'undefined' ? rowData[columnDef.field] : byString(rowData, columnDef.field));
    if (columnDef.lookup && lookup) {
        value = columnDef.lookup[value];
    }

    return value;
};

export default class Table extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        data: PropTypes.array.isRequired,
        columns: PropTypes.array.isRequired,
        options: PropTypes.object.isRequired,
        locale: PropTypes.string,
        actions: PropTypes.array,
        detailPanel: PropTypes.array,
        isExpandedRow: PropTypes.bool,
        editable: PropTypes.object,
        onSelectionChange: PropTypes.func
    };

    static defaultProps = {
        isExpandedRow: false
    };

    _exportCSV = (columns, data) => {
        const renderColumns = columns
            .filter((columnDef) => {
                return !columnDef.hidden && columnDef.field && columnDef.export !== false;
            });

        const renderData = data.map((rowData) =>
            renderColumns.map((columnDef) => getFieldValue(rowData, columnDef))
        );

        const builder = new CsvBuilder(this.props.title + '.csv');
        builder
            .setDelimeter(';')
            .setColumns(renderColumns.map((columnDef) => columnDef.title))
            .addRows(renderData)
            .exportFile();
    };

    _toggleRow = (event, rowData, togglePanel) => {
        return togglePanel();
    };

    render() {
        return (
            <Paper className="margin-top-30"
                // style={{maxWidth: 'calc(94vw - 15px)'}}
                   square={true}>
                <MaterialTable title={this.props.title}
                               columns={this.props.columns}
                               data={this.props.data}
                               options={{
                                   ...this.props.options,
                                   exportCsv: this._exportCSV
                               }}
                               actions={this.props.actions}
                               detailPanel={this.props.detailPanel}
                               onRowClick={this.props.isExpandedRow ? this._toggleRow : undefined}
                               editable={this.props.editable}
                               onSelectionChange={this.props.onSelectionChange}
                               localization={Localizations[this.props.locale] || {}}/>
            </Paper>
        );
    }
}
