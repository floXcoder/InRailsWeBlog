'use strict';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

export default class PersistenceFormTopic extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        onCancel: PropTypes.func.isRequired,
        onSubmit: PropTypes.func.isRequired,
        onDelete: PropTypes.func.isRequired,
        articleMultilanguage: PropTypes.bool,
        defaultMode: PropTypes.string,
        defaultVisibility: PropTypes.string,
        defaultLocale: PropTypes.string,
        topic: PropTypes.object,
        isEditing: PropTypes.bool
    };

    static defaultProps = {
        articleMultilanguage: false,
        defaultMode: 'default',
        defaultVisibility: 'only_me',
        topic: {},
        isEditing: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        name: this.props.isEditing ? this.props.topic.name : '',
        mode: this.props.isEditing ? this.props.topic.mode : this.props.defaultMode,
        description: this.props.isEditing ? this.props.topic.description : '',
        visibility: this.props.isEditing ? this.props.topic.visibility : this.props.defaultVisibility,
        locales: this.props.isEditing ? this.props.topic.locales : [this.props.defaultLocale]
    };

    _handleNameChange = (event) => {
        this.setState({
            name: event.target.value
        });
    };

    _handleModeChange = (event) => {
        this.setState({
            mode: event.target.value
        });
    };

    _handleDescriptionChange = (event) => {
        this.setState({
            description: event.target.value
        });
    };

    _handleVisibilityChange = (event) => {
        this.setState({
            visibility: event.target.value
        });
    };

    _handleLocaleChange = event => {
        this.setState({
            locales: event.target.value
        });
    };

    _handleTopicSubmit = (event) => {
        event.preventDefault();

        if (!event.target.checkValidity()) {
            return;
        }

        this.props.onSubmit(this.state.name, this.state.mode, this.state.description, this.state.visibility, this.state.locales);
    };

    _handleTopicDelete = (event) => {
        event.preventDefault();

        this.props.onDelete(this.props.topic.id);
    };

    _renderLanguagesSelect = (selected) => {
        return selected.join(', ');
    };

    render() {
        return (
            <form id="topic-persistence"
                  onSubmit={this._handleTopicSubmit}>
                <TextField className={this.props.classes.topicField}
                           variant="outlined"
                           fullWidth={true}
                           autoFocus={true}
                           required={true}
                           label={this.props.isEditing
                               ?
                               I18n.t('js.topic.edit.name')
                               :
                               I18n.t('js.topic.new.name')}
                           value={this.state.name}
                           onChange={this._handleNameChange}/>

                {
                    !this.props.topic.id &&
                    <TextField className={this.props.classes.topicField}
                               select={true}
                               required={true}
                               variant="outlined"
                               fullWidth={true}
                               label={I18n.t('js.topic.model.mode')}
                               value={this.state.mode}
                               onChange={this._handleModeChange}>
                        {
                            Object.keys(I18n.t('js.topic.enums.mode')).map((key) => (
                                <MenuItem key={key}
                                          value={key}>
                                    {I18n.t('js.topic.enums.mode')[key]}
                                </MenuItem>
                            ))
                        }
                    </TextField>
                }

                {
                    this.state.mode !== 'default' &&
                    <Typography className={this.props.classes.topicModeHelper}
                                variant="subtitle2"
                                gutterBottom={true}>
                        {I18n.t(`js.topic.common.modes.${this.state.mode || 'default'}`)}
                    </Typography>
                }

                {
                    this.state.mode === 'stories' &&
                    <TextField className={this.props.classes.topicField}
                               required={true}
                               variant="outlined"
                               fullWidth={true}
                               multiline={true}
                               label={
                                   this.props.isEditing
                                       ?
                                       I18n.t('js.topic.edit.description')
                                       :
                                       I18n.t('js.topic.new.description')
                               }
                               value={this.state.description}
                               onChange={this._handleDescriptionChange}/>
                }

                <TextField className={this.props.classes.topicField}
                           select={true}
                           required={true}
                           variant="outlined"
                           fullWidth={true}
                           label={I18n.t('js.topic.model.visibility')}
                           value={this.state.visibility}
                           onChange={this._handleVisibilityChange}>
                    {
                        Object.keys(I18n.t('js.topic.enums.visibility')).map((key) => (
                            <MenuItem key={key}
                                      value={key}>
                                {I18n.t('js.topic.enums.visibility')[key]}
                            </MenuItem>
                        ))
                    }
                </TextField>

                {
                    this.props.articleMultilanguage &&
                    <FormControl className={this.props.classes.topicField}
                                 fullWidth={true}>
                        <InputLabel id="topic-languages-label">
                            {I18n.t('js.topic.model.languages')}
                        </InputLabel>

                        <Select labelId="topic-languages-label"
                                id="topic-languages"
                                multiple={true}
                                value={this.state.locales}
                                onChange={this._handleLocaleChange}
                                input={<Input/>}
                                renderValue={this._renderLanguagesSelect}>
                            {
                                window.locales.map((locale) => (
                                    <MenuItem key={locale}
                                              value={locale}>
                                        <Checkbox checked={this.state.locales.indexOf(locale) > -1}/>
                                        <ListItemText primary={I18n.t(`js.languages.${locale}`)}/>
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                }

                <div className="center-align margin-top-20">
                    <Button color="primary"
                            variant="outlined"
                            type="submit">
                        {
                            this.props.isEditing
                                ?
                                I18n.t('js.topic.edit.submit')
                                :
                                I18n.t('js.topic.new.submit')
                        }
                    </Button>

                    {
                        this.props.isEditing &&
                        <div className="center-align margin-top-15">
                            <a href="#"
                               onClick={this._handleTopicDelete}>
                                {I18n.t('js.topic.edit.delete')}
                            </a>
                        </div>
                    }

                    <div className="center-align margin-top-15">
                        <a href="#"
                           onClick={this.props.onCancel}>
                            {I18n.t('js.topic.new.cancel')}
                        </a>
                    </div>
                </div>
            </form>
        );
    }
}
