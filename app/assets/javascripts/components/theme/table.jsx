import {useState, useReducer, useRef, useLayoutEffect} from 'react';
import PropTypes from 'prop-types';

import {Table as TableSuite, Pagination} from 'rsuite';

import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import CheckBox from '@mui/material/Checkbox';
import SearchIcon from '@mui/icons-material/Search';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';

import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EditIcon from '@mui/icons-material/Edit';
import UploadIcon from '@mui/icons-material/Upload';
import CloseIcon from '@mui/icons-material/Close';

const {
    Column,
    HeaderCell,
    Cell
} = TableSuite;

import 'rsuite/Table/styles/index.css';
import 'rsuite/Pagination/styles/index.css';

const MENU_ITEM_HEIGHT = 48;
const MIN_COLUMN_WIDTH = 80;
const MAX_COLUMN_WIDTH = 360;

function getProperty(propertyName, object) {
    const parts = propertyName.split('.');
    const length = parts.length;
    let i;
    let property = object || this;

    for (i = 0; i < length; i++) {
        property = property[parts[i]];
    }

    return property;
}

function transformDataValue(column, datum) {
    if (typeof column.value === 'function') {
        return column.value(datum);
    } else if (column.key && column.key.includes('.')) {
        return getProperty(column.key, datum);
    } else {
        return datum[column.value || column.key];
    }
}

function getColumnWidth(currentColumn, stringCountByKeys, isAdaptiveWidth, virtualized) {
    if (isAdaptiveWidth && !virtualized) {
        return;
    }

    let columnWidth = MIN_COLUMN_WIDTH;
    if (currentColumn.width) {
        columnWidth = currentColumn.width;
    } else if (currentColumn.name && isAdaptiveWidth) {
        columnWidth = (stringCountByKeys[currentColumn.key] || 1) * 10;
        if (columnWidth < currentColumn.name.length * 10) {
            columnWidth = currentColumn.name.length * 10;
        }
        if (columnWidth < MIN_COLUMN_WIDTH) {
            columnWidth = MIN_COLUMN_WIDTH;
        }
        if (columnWidth > MAX_COLUMN_WIDTH) {
            columnWidth = MAX_COLUMN_WIDTH;
        }
    }

    return columnWidth;
}

function serialiseCellValue(value) {
    if (typeof value === 'string') {
        const formattedValue = value.replace(/"/g, '""');
        return `"${formattedValue}"`;
    }
    return value;
}

function downloadFile(fileName, data) {
    const downloadLink = document.createElement('a');
    downloadLink.download = fileName;
    const url = URL.createObjectURL(data);
    downloadLink.href = url;
    downloadLink.click();
    URL.revokeObjectURL(url);
}

function exportToCsv(dataColumns, dataRows, fileName) {
    const exportedColumns = dataColumns.filter((col) => col.hidden !== true);

    const head = exportedColumns.map((col) => col.name)
        .join(',');
    const body = dataRows.map((data) => exportedColumns.map((col) => data[col.key])
        .map(serialiseCellValue)
        .join(','));

    const content = [head, ...body].join('\n');

    downloadFile(fileName, new Blob([content], {type: 'text/csv;charset=utf-8;'}));
}

function exportToCsvForExcel(dataColumns, dataRows, fileName) {
    const exportedColumns = dataColumns.filter((col) => col.hidden !== true);

    const head = exportedColumns.map((col) => col.name)
        .join(';');
    const body = dataRows.map((data) => exportedColumns.map((col) => data[col.key])
        .map(serialiseCellValue)
        .join(';'));

    const content = [head, ...body]
        .join('\n')
        .replaceAll(/(\d)\.(\d)/g, '$1,$2');

    downloadFile(fileName, new Blob([content], {type: 'text/csv;charset=utf-8;'}));
}

// export async function exportToXlsx(gridElement, fileName) {
//     const [{ utils, writeFile }, { head, body, foot }] = await Promise.all([
//         import('xlsx'),
//         getGridContent(gridElement)
//     ]);
//     const wb = utils.book_new();
//     const ws = utils.aoa_to_sheet([...head, ...body, ...foot]);
//     utils.book_append_sheet(wb, ws, 'Sheet 1');
//     writeFile(wb, fileName);
// }

// export async function exportToPdf(gridElement, fileName) {
//     const [{ jsPDF }, autoTable, { head, body, foot }] = await Promise.all([
//         import('jspdf'),
//         (await import('jspdf-autotable')).default,
//         await getGridContent(gridElement)
//     ]);
//     const doc = new jsPDF({
//         orientation: 'l',
//         unit: 'px'
//     });
//
//     autoTable(doc, {
//         head,
//         body,
//         foot,
//         horizontalPageBreak: true,
//         styles: { cellPadding: 1.5, fontSize: 8, cellWidth: 'wrap' },
//         tableWidth: 'wrap'
//     });
//     doc.save(fileName);
// }

function ColumnSelector({
                            children,
                            handleCheckboxClick,
                            hiddenColumns
                        }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event) => {
        event.preventDefault();

        if (event.currentTarget.nodeName === 'LI') {
            return;
        }

        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton id="hidden-button"
                        onClick={handleClick}>
                <ViewCarouselIcon/>
            </IconButton>

            <Menu id="hidden-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  PaperProps={{
                      style: {
                          maxHeight: MENU_ITEM_HEIGHT * 10,
                          width: '40vh'
                      }
                  }}>
                {
                    children.map((entry, i) => (
                        <MenuItem key={entry.id || i}
                                  onClick={handleClose}>
                            <FormControlLabel control={
                                <CheckBox checked={!hiddenColumns.has(entry.id)}
                                          tabIndex={-1}/>
                            }
                                              onClick={handleCheckboxClick.bind(this, entry.id)}
                                              label={entry.name}/>
                        </MenuItem>
                    ))
                }
            </Menu>
        </div>
    );
}

function ExportButton({
                          onExport,
                          children
                      }) {
    const [exporting, setExporting] = useState(false);

    return (
        <Button className="export-button"
                variant="outlined"
                size="small"
                disabled={exporting}
                onClick={() => {
                    setExporting(true);
                    onExport();
                    setExporting(false);
                }}>
            {exporting ? 'Exporting ...' : children}
        </Button>
    );
}

const CheckCell = ({
                       rowData,
                       onChange,
                       checkedKeys,
                       dataKey,
                       ...props
                   }) => (
    <Cell {...props}
          style={{padding: 0}}>
        <div style={{lineHeight: '46px'}}>
            <CheckBox value={rowData[dataKey]}
                      inline
                      onChange={onChange}
                      checked={checkedKeys.some(item => item === rowData[dataKey])}/>
        </div>
    </Cell>
);

const ExpandCell = ({
                        rowData,
                        dataIdentifier,
                        expandedRowKeys,
                        onChange,
                        ...props
                    }) => (
    <Cell {...props}
          style={{padding: 0}}>
        <IconButton aria-label="Show more"
                    size="large"
                    onClick={() => {
                        onChange(rowData, dataIdentifier);
                    }}>
            {
                expandedRowKeys.some((key) => key === rowData[dataIdentifier])
                    ?
                    <ExpandMoreIcon/>
                    :
                    <ExpandLessIcon/>
            }
        </IconButton>
    </Cell>
);

const ActionsCell = ({
                         rowData,
                         originalData,
                         dataIdentifier,
                         actions,
                         ...props
                     }) => {
    actions = actions.map((action) => typeof action === 'function' ? action(rowData) : action);

    const originalRowData = originalData.find((item) => item[dataIdentifier] === rowData[dataIdentifier]);

    return (
        <Cell {...props}
              style={{padding: 0}}>
            {
                actions.map((action, i) => (
                    <Tooltip key={i}
                             title={action.tooltip}>
                        <IconButton style={{padding: '4px 10px'}}
                                    aria-label={action.tooltip}
                                    size="medium"
                                    color="default"
                                    onClick={(event) => action.onClick(event, originalRowData)}>
                           <span className="material-icons notranslate MuiIcon-root MuiIcon-fontSizeMedium"
                                 aria-hidden="true"
                                 style={action.iconProps?.style}>
                               {action.icon}
                           </span>
                        </IconButton>
                    </Tooltip>
                ))
            }
        </Cell>
    );
};

const ActionCell = ({
                        rowData,
                        dataIdentifier,
                        editingRowKeys,
                        onEdit,
                        onSubmitEdit,
                        onCancelEdit,
                        ...props
                    }) => {
    const isEditing = editingRowKeys.includes(rowData[dataIdentifier]);

    return (
        <Cell {...props}
              style={{
                  padding: '6px',
                  display: 'flex',
                  gap: '4px'
              }}>
            {
                isEditing
                    ?
                    <>
                        <IconButton style={{padding: '4px 10px'}}
                                    size="medium"
                                    color="default"
                                    onClick={() => onSubmitEdit(rowData, dataIdentifier)}>
                            <UploadIcon color="default"
                                        fontSize="medium"/>
                        </IconButton>

                        <IconButton style={{padding: '4px 10px'}}
                                    size="medium"
                                    color="default"
                                    onClick={() => onCancelEdit(rowData[dataIdentifier])}>
                            <CloseIcon color="default"
                                       fontSize="medium"/>
                        </IconButton>
                    </>
                    :
                    <IconButton style={{padding: '4px 10px'}}
                                size="medium"
                                color="default"
                                onClick={() => onEdit(rowData[dataIdentifier])}>
                        <EditIcon color="default"
                                  fontSize="medium"/>
                    </IconButton>
            }
        </Cell>
    );
};

const EditableCell = ({
                          originalData,
                          rowData,
                          dataKey,
                          dataIdentifier,
                          cellType,
                          editingRowKeys,
                          onChangeEdit,
                          onSubmitEdit,
                          ...props
                      }) => {
    const isEditing = editingRowKeys.includes(rowData[dataIdentifier]);

    let value = rowData[dataKey];
    if (isEditing) {
        const originalRowData = originalData.find((d) => d[dataIdentifier] === rowData[dataIdentifier]);
        if (dataKey.includes('.')) {
            value = getProperty(dataKey, originalRowData);
        } else {
            value = originalRowData[dataKey];
        }
    }

    const onKeyUp = (event) => {
        if (event.key !== 'Enter') {
            return;
        }

        rowData[dataKey] = event.target.value;

        onSubmitEdit(rowData, dataIdentifier);
    };

    const renderCell = (val) => {
        if (cellType === 'boolean') {
            return val === true || val === 'true' ? '✓' : '-';
        } else {
            return val;
        }
    };

    const renderEditingCell = (val) => {
        if (cellType === 'boolean') {
            return (
                <CheckBox defaultChecked={val}
                          value="true"
                          color="primary"
                          onChange={(event) => onChangeEdit(rowData[dataIdentifier], dataKey, event.target.checked)}/>
            );
        } else {
            return (
                <TextField defaultValue={val}
                           onKeyUp={onKeyUp}
                           onChange={(event) => onChangeEdit(rowData[dataIdentifier], dataKey, event.target.value)}/>
            );
        }
    };

    return (
        <Cell {...props}
              className={isEditing ? 'table-cell-editing' : ''}>
            {
                isEditing
                    ?
                    renderEditingCell(value)
                    :
                    renderCell(value)
            }
        </Cell>
    );
};

function ExpandedComponent({
                               expendable,
                               rowExpandedHeight,
                               rowData
                           }) {
    const myRef = useRef(null);

    useLayoutEffect(() => {
        if (rowExpandedHeight) {
            return;
        }

        const element = myRef.current;

        const currentHeight = parseInt(element.parentNode.style.height);

        const heightDiff = parseInt(element.clientHeight) - currentHeight + 240;

        if (heightDiff > 0) {
            element.parentNode.style.height = parseInt(element.parentNode.style.height) + heightDiff + 'px';
            element.parentNode.parentNode.style.height = parseInt(element.parentNode.parentNode.style.height) + heightDiff + 'px';
            element.parentNode.parentNode.parentNode.style.height = parseInt(element.parentNode.parentNode.parentNode.style.height) + heightDiff + 'px';
        }
    }, []);

    return (
        <div ref={myRef}>
            {expendable(rowData)}
        </div>
    );
}

const reducer = ({
                     data,
                     rows = [],
                     columns,
                     dataIdentifier,
                     page,
                     limit
                 }, action) => {
    const stringCountByKeys = {};

    const filterableKeys = action?.search ? columns.filter((col) => col.filterable !== false).map((col) => col.key) : [];

    if (!rows.length || action?.search) {
        data.forEach((datum) => {
            const row = {};

            columns.forEach((column) => {
                row[column.key] = transformDataValue(column, datum);

                stringCountByKeys[column.key] = (row[column.key]?.length || 0) > (stringCountByKeys[column.key]?.length || 0) ? row[column.key]?.length : stringCountByKeys[column.key];
            });

            if (action?.search && filterableKeys.length) {
                if (!filterableKeys.some((dataKey) => datum[dataKey]?.toString()
                    .toLowerCase()
                    ?.includes(action.search.toLowerCase()))) {
                    return;
                }
            }

            rows.push(row);
        });
    }

    if (action?.editedDataId) {
        if (action.editedCancel) {
            const editedIndex = rows.findIndex((row) => row[dataIdentifier] === action.editedDataId);
            const editedData = data.find((row) => row[dataIdentifier] === action.editedDataId);
            columns.forEach((column) => {
                editedData[column.key] = transformDataValue(column, editedData);
            });
            rows[editedIndex] = editedData;
        } else {
            const editingRow = rows.find((row) => row[dataIdentifier] === action.editedDataId);

            if (action.editedDataKey) {
                editingRow[action.editedDataKey] = action.editedDataValue;
            }
        }
    }

    if (action?.sortColumn && action?.sortType) {
        rows.sort((a, b) => {
            let x = a[action.sortColumn];
            let y = b[action.sortColumn];

            if (typeof x === 'string') {
                x = x.charCodeAt();
            }

            if (typeof y === 'string') {
                y = y.charCodeAt();
            }

            if (action.sortType === 'asc') {
                return x - y;
            } else {
                return y - x;
            }
        });
    }

    page ||= action?.page;
    limit ||= action?.limit;

    if (limit || page) {
        rows = rows.filter((v, i) => {
            const start = limit * (page - 1);
            const end = start + limit;
            return i >= start && i < end;
        });
    }

    return {
        data,
        rows,
        columns,
        dataIdentifier,
        stringCountByKeys
    };
};

const styles = `
.rs-table-cell-header .rs-table-cell-content {
  font-size: 15px;
}

.rs-table-cell .rs-table-cell-content a {
  padding-top: 0;
  padding-bottom: 0;
}

.rs-checkbox {
  padding-left: 6px;
  padding-right: 12px;
}

.table-cell-editing .rs-table-cell-content {
  padding: 4px;
}
.table-cell-editing .MuiTextField-root {
  width: 96%;
}
.table-cell-editing .MuiInputBase-input {
  padding: 6px;
  width: 100%;
}
`;

// Evolves:
// Manage this option
// options={{
//     rowStyle: this._lastProductStyle
// }}

export default function Table({
                                  dataIdentifier = 'id',
                                  uniqColId = 'id',
                                  columns,
                                  data,
                                  title,
                                  rowHeight,
                                  hasFiltering = true,
                                  isSortable = true,
                                  isShowFullTextHover = true,
                                  virtualized = false,
                                  isPaginated = false,
                                  pageLimits = [100, 500, 1000],
                                  initialPageLimit = 100,
                                  initialPage = 1,
                                  isAdaptiveWidth = true,
                                  hasExport = true,
                                  hasSelection = false,
                                  onSelectionChange,
                                  expendable,
                                  rowExpandedHeight,
                                  editable,
                                  actions
                              }) {
    const [hiddenColumns, setHiddenColumns] = useState(new Set(columns.filter((c) => !!c.hidden).map((c) => c.key)));
    const [search, setSearch] = useState('');

    const [sortColumn, setSortColumn] = useState();
    const [sortType, setSortType] = useState();
    // const [loading, setLoading] = useState(false);

    const [limit, setLimit] = useState(initialPageLimit);
    const [page, setPage] = useState(initialPage);

    const [checkedKeys, setCheckedKeys] = useState([]);

    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    const [editingRowKeys, setEditingRowKeys] = useState([]);

    const [reducedData, dispatchData] = useReducer(reducer, {
        data,
        columns,
        dataIdentifier,
        page: isPaginated ? page : undefined,
        limit: isPaginated ? limit : undefined
    }, reducer);

    const _handleHiddenChange = (columnKey) => {
        const hiddenCols = new Set(hiddenColumns);

        if (hiddenCols.has(columnKey)) {
            hiddenCols.delete(columnKey);
        } else {
            hiddenCols.add(columnKey);
        }

        setHiddenColumns(hiddenCols);
    };

    const _handleSearchChange = (event) => {
        setSearch(event.target.value);

        dispatchData({
            search: event.target.value
        });
    };

    const _handleSortColumn = (columnToSort, typeToSort) => {
        // setLoading(true);

        setSortColumn(columnToSort);
        setSortType(typeToSort);

        dispatchData({
            sortColumn: columnToSort,
            sortType: typeToSort
        });
    };

    const _handleSelection = (value, checked) => {
        const keys = checked ? [...checkedKeys, value] : checkedKeys.filter(item => item !== value);
        setCheckedKeys(keys);

        onSelectionChange(keys);
    };

    const _handleExpanded = (rowData) => {
        let open = false;
        const nextExpandedRowKeys = [];

        expandedRowKeys.forEach((key) => {
            if (key === rowData[dataIdentifier]) {
                open = true;
            } else {
                nextExpandedRowKeys.push(key);
            }
        });

        if (!open) {
            nextExpandedRowKeys.push(rowData[dataIdentifier]);
        }

        setExpandedRowKeys(nextExpandedRowKeys);
    };

    const _handleEdit = (rowDataIdentifier) => {
        let isEditing = false;
        const nextEditingRowKeys = [];

        editingRowKeys.forEach((key) => {
            if (key === rowDataIdentifier) {
                isEditing = true;
            } else {
                nextEditingRowKeys.push(key);
            }
        });

        if (!isEditing) {
            nextEditingRowKeys.push(rowDataIdentifier);
        }

        setEditingRowKeys(nextEditingRowKeys);
    };

    const _handleChangeEdit = (id, key, value) => {
        dispatchData({
            editedDataId: id,
            editedDataKey: key,
            editedDataValue: value
        });
    };

    const _handleSubmitEdit = (rowData, rowDataIdentifier) => {
        setEditingRowKeys(editingRowKeys.filter((rowDataId) => rowDataId !== rowData[rowDataIdentifier]));

        editable(rowData);
    };

    const _handleCancelEdit = (id) => {
        setEditingRowKeys(editingRowKeys.filter((rowDataIdentifier) => rowDataIdentifier !== id));

        dispatchData({
            editedDataId: id,
            editedCancel: true
        });
    };

    const _handlePaginationChange = (newPage) => {
        setPage(newPage);

        dispatchData({
            page: newPage,
            limit
        });
    };

    const _handleLimitChange = (newLimit) => {
        setPage(1);
        setLimit(newLimit);

        dispatchData({
            limit: newLimit,
            page
        });
    };

    return (
        <Paper className="margin-top-30"
               square={true}>
            <style>{styles}</style>

            <Grid container={true}
                  style={{marginInline: '1rem'}}
                  spacing={2}
                  minHeight={54}>
                <Grid display="flex"
                      justifyContent="start"
                      alignItems="center"
                      size="grow">
                    {
                        !!title &&
                        title
                    }
                </Grid>

                {
                    !!hasExport &&
                    <>
                        <Grid display="flex"
                              justifyContent="center"
                              alignItems="center">
                            <ExportButton
                                onExport={() => exportToCsv(reducedData.columns, reducedData.rows, title || 'export.csv')}>
                                Export to CSV
                            </ExportButton>
                        </Grid>

                        <Grid display="flex"
                              justifyContent="center"
                              alignItems="center">
                            <ExportButton
                                onExport={() => exportToCsvForExcel(reducedData.columns, reducedData.rows, title || 'export.csv')}>
                                Export to CSV (Excel format)
                            </ExportButton>
                        </Grid>
                    </>
                }

                <Grid display="flex"
                      justifyContent="center"
                      alignItems="center">
                    {
                        columns.some((column) => column.hidden) &&
                        <ColumnSelector hiddenColumns={hiddenColumns}
                                        handleCheckboxClick={_handleHiddenChange}>
                            {
                                columns.map((col) => ({
                                    id: col.key,
                                    name: col.name
                                }))
                            }
                        </ColumnSelector>
                    }
                </Grid>

                <Grid display="flex"
                      justifyContent="center"
                      alignItems="center">
                    {
                        !!hasFiltering &&
                        <TextField id="table-search"
                                   variant="standard"
                                   slotProps={{
                                       input: {
                                           startAdornment: (
                                               <InputAdornment position="start">
                                                   <SearchIcon/>
                                               </InputAdornment>
                                           )
                                       }
                                   }}
                                   placeholder="Search"
                                   value={search}
                                   onChange={_handleSearchChange}/>
                    }
                </Grid>
            </Grid>

            <TableSuite height={virtualized ? 800 : undefined}
                        autoHeight={!virtualized}
                        rowHeight={rowHeight}
                        shouldUpdateScroll={false} // Prevent the scrollbar from scrolling to the top after the table content area height changes.
                        data={reducedData.rows}
                        virtualized={virtualized}
                        sortColumn={sortColumn}
                        sortType={sortType}
                        onSortColumn={_handleSortColumn}
                        rowKey={uniqColId} // Must be unique in data
                        expandedRowKeys={expandedRowKeys}
                        renderRowExpanded={
                            (rowData) => <ExpandedComponent expendable={expendable}
                                                            rowExpandedHeight={rowExpandedHeight}
                                                            rowData={data.find((d) => d[dataIdentifier] === rowData[dataIdentifier])}/>
                        }
                        rowExpandedHeight={rowExpandedHeight || 400}
                        loading={false}>
                {
                    !!hasSelection &&
                    <Column width={50}
                            align="center">
                        <HeaderCell>#</HeaderCell>
                        <CheckCell dataKey={dataIdentifier}
                                   checkedKeys={checkedKeys}
                                   onChange={_handleSelection}/>
                    </Column>
                }

                {
                    !!expendable &&
                    <Column width={70}
                            align="center">
                        <HeaderCell>#</HeaderCell>
                        <ExpandCell dataIdentifier={dataIdentifier}
                                    expandedRowKeys={expandedRowKeys}
                                    onChange={_handleExpanded}/>
                    </Column>
                }

                {
                    columns
                        .filter((col) => !hiddenColumns.has(col.key))
                        .map((column, i) => {
                            if (!column.key) {
                                console.warn(`Key is missing for Table Column: ${column.name}`);
                            }
                            if (!column.name) {
                                console.warn(`Name is missing for Table Column: ${column.key}`);
                            }

                            return (
                                <Column key={column.key}
                                        width={getColumnWidth(column, reducedData.stringCountByKeys, isAdaptiveWidth, virtualized)}
                                        flexGrow={column.width || virtualized ? undefined : 1}
                                        sortable={isSortable}
                                        fixed={column.fixed || i === 0}
                                        fullText={isShowFullTextHover}>
                                    <HeaderCell>
                                        {column.name}
                                    </HeaderCell>

                                    {
                                        (!!editable && column.editable !== false)
                                            ?
                                            <EditableCell dataKey={column.key}
                                                          dataIdentifier={dataIdentifier}
                                                          editingRowKeys={editingRowKeys}
                                                          originalData={data}
                                                          cellType={column.type}
                                                          onChangeEdit={_handleChangeEdit}
                                                          onSubmitEdit={_handleSubmitEdit}/>
                                            :
                                            <Cell dataKey={column.key}/>
                                    }
                                </Column>
                            );
                        })
                }

                {
                    !!actions &&
                    <Column flexGrow={1}
                            align="center">
                        <HeaderCell><strong>Actions</strong></HeaderCell>
                        <ActionsCell originalData={data}
                                     dataIdentifier={dataIdentifier}
                                     actions={actions}/>
                    </Column>
                }

                {
                    !!editable &&
                    <Column align="center">
                        <HeaderCell><strong>Actions</strong></HeaderCell>
                        <ActionCell dataIdentifier={dataIdentifier}
                                    editingRowKeys={editingRowKeys}
                                    onEdit={_handleEdit}
                                    onSubmitEdit={_handleSubmitEdit}
                                    onCancelEdit={_handleCancelEdit}/>
                    </Column>
                }
            </TableSuite>

            {
                !!isPaginated &&
                <div style={{padding: 20}}>
                    <Pagination prev={true}
                                next={true}
                                first={true}
                                last={true}
                                ellipsis={true}
                                boundaryLinks={true}
                                maxButtons={5}
                                size="md"
                                layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                                total={data.length}
                                limitOptions={pageLimits}
                                limit={limit}
                                activePage={page}
                                onChangePage={_handlePaginationChange}
                                onChangeLimit={_handleLimitChange}/>
                </div>
            }
        </Paper>
    );
}

Table.propTypes = {
    dataIdentifier: PropTypes.string,
    uniqColId: PropTypes.string,
    columns: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string,
        name: PropTypes.string,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.func
        ]),
        width: PropTypes.number,
        hidden: PropTypes.bool,
        fixed: PropTypes.bool,
        filterable: PropTypes.bool,
        // resizable: PropTypes.bool,
    })).isRequired,
    data: PropTypes.array.isRequired,
    hasFiltering: PropTypes.bool,
    virtualized: PropTypes.bool,
    isAdaptiveWidth: PropTypes.bool,
    isShowFullTextHover: PropTypes.bool,
    isSortable: PropTypes.bool,
    isPaginated: PropTypes.bool,
    pageLimits: PropTypes.array,
    rowHeight: PropTypes.number,
    initialPageLimit: PropTypes.number,
    initialPage: PropTypes.number,
    title: PropTypes.string,
    hasExport: PropTypes.bool,
    hasSelection: PropTypes.bool,
    onSelectionChange: PropTypes.func,
    expendable: PropTypes.func,
    rowExpandedHeight: PropTypes.number,
    editable: PropTypes.func,
    actions: PropTypes.array
};
