import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import NativeSelect from '@mui/material/NativeSelect';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import I18n from '@js/modules/translations';


export default class TopicFormInventoryFieldDisplay extends React.Component {
    static propTypes = {
        index: PropTypes.number.isRequired,
        field: PropTypes.object.isRequired,
        onRemoveField: PropTypes.func.isRequired,
        dragHandle: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    state = {
        isSourceExpanded: false,
        required: this.props.field.required || false,
        searchable: this.props.field.searchable || false,
        filterable: this.props.field.filterable || false
    };

    _handleCheckboxChanged = (state, event) => {
        this.setState({
            [state]: event.target.checked
        });
    };

    _handleExpandClick = (event) => {
        event.preventDefault();

        this.setState((state) => ({
            isSourceExpanded: !state.isSourceExpanded
        }));
    };

    render() {
        const DragHandle = this.props.dragHandle;

        return (
            <Grid className="topic-form-inv-field-border"
                  container={true}
                  spacing={2}
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center">
                {
                    !!this.props.field.fieldName &&
                    <input name="inventory_field[fields][][field_name]"
                           defaultValue={this.props.field.fieldName}
                           type="hidden"/>
                }

                <input name="inventory_field[fields][][priority]"
                       defaultValue={this.props.field.priority || 0}
                       type="hidden"/>

                <div className="topic-form-inv-field-drag">
                    <DragHandle/>
                </div>

                <Grid size={{sm: 12, lg: 6}}>
                    <TextField className="topic-form-inv-field"
                               fullWidth={true}
                               variant="outlined"
                               name="inventory_field[fields][][name]"
                               label={I18n.t('js.inventory_fields.model.name')}
                               required={true}
                               defaultValue={this.props.field.name}/>
                </Grid>

                <Grid size={{sm: 12, lg: 6}}>
                    <FormControl className="topic-form-inv-field"
                                 required={true}>
                        <InputLabel htmlFor="inventory_fields-value_type">
                            {I18n.t('js.inventory_fields.model.value_type')}
                        </InputLabel>

                        <NativeSelect input={
                            <Input id="inventory_fields-value_type"
                                   name="inventory_field[fields][][value_type]"/>
                        }
                                      defaultValue={this.props.field.valueType}>
                            {
                                Object.keys(I18n.t('js.inventory_fields.enums.value_type')).map((key) => (
                                    <option key={key}
                                            value={key}>
                                        {I18n.t('js.inventory_fields.enums.value_type')[key]}
                                    </option>
                                ))
                            }
                        </NativeSelect>
                    </FormControl>
                </Grid>

                <Grid size={{sm: 12}}>
                    <a className="topic-form-inv-field-props-button"
                       href="#"
                       onClick={this._handleExpandClick}>
                        <Typography variant="body1"
                                    gutterBottom={false}>
                            {I18n.t('js.topic.edit_inventories.field_props')}


                            <IconButton
                                className={classNames('topic-form-inv-field-props-expand', {
                                    'topic-form-inv-field-props-expandOpen': this.state.isSourceExpanded
                                })}
                                aria-label="Show more"
                                size="large">
                                <ExpandMoreIcon/>
                            </IconButton>
                        </Typography>
                    </a>
                </Grid>

                <Collapse in={this.state.isSourceExpanded}
                          timeout="auto"
                          unmountOnExit={true}>
                    <Grid container={true}
                          spacing={4}
                          direction="row"
                          justifyContent="center"
                          alignItems="center">
                        <Grid size={{xs: 12}}>
                            <FormControlLabel className="topic-form-inv-field"
                                              label={I18n.t('js.inventory_fields.model.required')}
                                              control={
                                                  <Checkbox checked={this.state.required}
                                                            onChange={this._handleCheckboxChanged.bind(this, 'required')}
                                                            value="true"
                                                            color="primary"/>
                                              }/>

                            <input name="inventory_field[fields][][required]"
                                   value={this.state.required}
                                   type="hidden"/>
                        </Grid>

                        <Grid size={{sm: 12, lg: 6}}>
                            <FormControlLabel className="topic-form-inv-field"
                                              label={I18n.t('js.inventory_fields.model.searchable')}
                                              control={
                                                  <Checkbox checked={this.state.searchable}
                                                            onChange={this._handleCheckboxChanged.bind(this, 'searchable')}
                                                            value="true"
                                                            color="primary"/>
                                              }/>

                            <input name="inventory_field[fields][][searchable]"
                                   value={this.state.searchable}
                                   type="hidden"/>
                        </Grid>

                        <Grid size={{sm: 12, lg: 6}}>
                            <FormControlLabel className="topic-form-inv-field"
                                              label={I18n.t('js.inventory_fields.model.filterable')}
                                              control={
                                                  <Checkbox checked={this.state.filterable}
                                                            onChange={this._handleCheckboxChanged.bind(this, 'filterable')}
                                                            value="true"
                                                            color="primary"/>
                                              }/>

                            <input name="inventory_field[fields][][filterable]"
                                   value={this.state.filterable}
                                   type="hidden"/>
                        </Grid>

                        <Grid className="center-align"
                              size={{sm: 12}}>
                            <Button
                                variant="text"
                                size="small"
                                onClick={this.props.onRemoveField.bind(this, this.props.index)}>
                                {I18n.t('js.topic.edit_inventories.remove_field')}
                            </Button>
                        </Grid>
                    </Grid>
                </Collapse>
            </Grid>
        );
    }
}
