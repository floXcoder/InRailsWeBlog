'use strict';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

export default class TopicFormInventoryFieldDisplay extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
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
            <Grid className={this.props.classes.fieldBorder}
                  container={true}
                  spacing={2}
                  direction="row"
                  justify="flex-start"
                  alignItems="center">
                {
                    this.props.field.fieldName &&
                    <input name="inventory_field[fields][][field_name]"
                           defaultValue={this.props.field.fieldName}
                           type="hidden"/>
                }

                <input name="inventory_field[fields][][priority]"
                       defaultValue={this.props.field.priority || 0}
                       type="hidden"/>

                <div className={this.props.classes.fieldDrag}>
                    <DragHandle/>
                </div>

                <Grid item={true}
                      sm={12}
                      lg={6}>
                    <TextField className={this.props.classes.field}
                               fullWidth={true}
                               variant="outlined"
                               name="inventory_field[fields][][name]"
                               label={I18n.t('js.inventory_fields.model.name')}
                               required={true}
                               defaultValue={this.props.field.name}/>
                </Grid>

                <Grid item={true}
                      sm={12}
                      lg={6}>
                    <FormControl className={this.props.classes.field}
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

                <Grid item={true}
                      sm={12}>
                    <a className={this.props.classes.fieldPropsButton}
                       href="#"
                       onClick={this._handleExpandClick}>
                        <Typography variant="body1"
                                    gutterBottom={false}>
                            {I18n.t('js.topic.edit_inventories.field_props')}


                            <IconButton className={classNames(this.props.classes.fieldPropsExpand, {
                                [this.props.classes.fieldPropsExpandOpen]: this.state.isSourceExpanded
                            })}
                                        aria-label="Show more">
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
                          justify="center"
                          alignItems="center">
                        <Grid item={true}
                              xs={12}>
                            <FormControlLabel className={this.props.classes.field}
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

                        <Grid item={true}
                              sm={12}
                              lg={6}>
                            <FormControlLabel className={this.props.classes.field}
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

                        <Grid item={true}
                              sm={12}
                              lg={6}>
                            <FormControlLabel className={this.props.classes.field}
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
                              item={true}
                              sm={12}>
                            <Button color="default"
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
