'use strict';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';

var TopicFormMandatoryFieldDisplay = function () {
    return (
        <div className="col s12">
            <Grid className="topic-form-inv-fieldBorder"
                  container={true}
                  spacing={2}
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center">
                <Grid item={true}
                      sm={12}
                      lg={6}>
                    <TextField className="topic-form-inv-field"
                               fullWidth={true}
                               variant="outlined"
                               label={I18n.t('js.inventory_fields.model.name')}
                               disabled={true}
                               defaultValue="Titre"/>
                </Grid>

                <Grid item={true}
                      sm={12}
                      lg={6}>
                    <FormControl className="topic-form-inv-field"
                                 disabled={true}>
                        <InputLabel htmlFor="inventory_fields-value_type">
                            {I18n.t('js.inventory_fields.model.value_type')}
                        </InputLabel>

                        <NativeSelect defaultValue="string_type">
                            <option value="string_type">
                                {I18n.t('js.inventory_fields.enums.value_type.string_type')}
                            </option>
                        </NativeSelect>
                    </FormControl>
                </Grid>

                <Grid className="topic-form-inv-mandatoryFieldHelper"
                      item={true}
                      sm={12}>
                    {I18n.t('js.topic.edit_inventories.mandatory_field')}
                </Grid>
            </Grid>
        </div>
    );
};

export default TopicFormMandatoryFieldDisplay;
