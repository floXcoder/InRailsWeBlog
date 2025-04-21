import React from 'react';
import PropTypes from 'prop-types';

import {
    Field
} from 'react-final-form';

import Grid from '@mui/material/Grid';

import I18n from '@js/modules/translations';

import EditorField from '@js/components/editor/form/editor';

import TextFormField from '@js/components/material-ui/form/text';
import NumberFormField from '@js/components/material-ui/form/number';
import DateFormField from '@js/components/material-ui/form/date';
import CheckBoxFormField from '@js/components/material-ui/form/checkbox';


export default class ArticleInventoriesField extends React.Component {
    static propTypes = {
        currentUserId: PropTypes.number.isRequired,
        currentTopicId: PropTypes.number.isRequired,
        inventoryFields: PropTypes.array.isRequired,
        change: PropTypes.func.isRequired,
        article: PropTypes.object
    };

    static defaultProps = {
        article: {}
    };

    constructor(props) {
        super(props);

        this._pictureIds = null;
    }

    _handleImageUploaded = (image) => {
        this.props.change('picture_ids', this._pictureIds ? this._pictureIds.split(',')
            .concat(image.id)
            .join(',') : image.id.toString());
    };

    _helperTextField = (field) => {
        if (field.searchable) {
            return I18n.t('js.article.form.inventories.searchable');
        } else if (field.filterable) {
            return I18n.t('js.article.form.inventories.filterable');
        } else {
            return undefined;
        }
    };

    _renderFieldByType = (field) => {
        if (field.valueType === 'string_type') {
            return (
                <Field name={`inventories[${field.fieldName}]`}
                       component={TextFormField}
                       className="article-form-inventory-field"
                       variant="outlined"
                       color="primary"
                       fullWidth={true}
                       label={field.name}
                       required={field.required}
                       helperText={this._helperTextField(field)}/>
            );
        } else if (field.valueType === 'date_type') {
            return (
                <Field name={`inventories[${field.fieldName}]`}
                       component={DateFormField}
                       className="article-form-inventory-field"
                       variant="outlined"
                       color="primary"
                       fullWidth={true}
                       label={field.name}
                       required={field.required}
                       helperText={this._helperTextField(field)}/>
            );
        } else if (field.valueType === 'number_type') {
            return (
                <Field name={`inventories[${field.fieldName}]`}
                       component={NumberFormField}
                       className="article-form-inventory-field"
                       variant="outlined"
                       color="primary"
                       fullWidth={true}
                       label={field.name}
                       required={field.required}
                       helperText={this._helperTextField(field)}/>
            );
        } else if (field.valueType === 'boolean_type') {
            return (
                <Field name={`inventories[${field.fieldName}]`}
                       type="checkbox"
                       component={CheckBoxFormField}
                       className="article-form-inventory-field"
                       color="primary"
                       label={field.name}
                       required={field.required}/>
            );
        } else if (field.valueType === 'text_type') {
            return (
                <Field name={`inventories[${field.fieldName}]`}
                       component={EditorField}
                       id={field.fieldName}
                       className="article-form-inventory-field"
                       modelName="article"
                       modelId={this.props.article.id}
                       currentUserId={this.props.currentUserId}
                       currentTopicId={this.props.currentTopicId}
                       placeholder={field.name}
                       onImageUpload={this._handleImageUploaded}/>
            );
        } else {
            throw new Error(`Unknown field type to render: ${field.valueType}`);
        }
    };

    render() {
        return (
            <Grid className="article-form-inventory-fields"
                  container={true}
                  spacing={0}
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center">
                <Grid size={{sm: 12}}>
                    <Field name="title"
                           component={TextFormField}
                           className="article-form-inventory-field"
                           id="article_title"
                           label={I18n.t('js.article.common.placeholders.title.inventory')}
                           required={true}
                           fullWidth={true}
                           autoFocus={true}
                           color="primary"/>
                </Grid>

                {
                    this.props.inventoryFields.map((field, i) => (
                        <Grid key={`${this.props.article.id}-${field.fieldName}-${i}`}
                              size={{sm: 12}}>
                            {this._renderFieldByType(field)}
                        </Grid>
                    ))
                }
            </Grid>
        );
    }
}
