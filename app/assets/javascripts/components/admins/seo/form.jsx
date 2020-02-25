'use strict';

import Button from '@material-ui/core/Button/Button';
import TextField from '@material-ui/core/TextField/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Separator from '../../theme/separator';

export default class AdminSeoDataForm extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        seoPages: PropTypes.array.isRequired,
        retrieveParameters: PropTypes.func.isRequired,
        onPersistSeoData: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        seoPagesUsed: PropTypes.array,
        seoData: PropTypes.object,
        isNew: PropTypes.bool
    };

    static defaultProps = {
        seoPagesUsed: [],
        seoData: {},
        isNew: false
    };

    constructor(props) {
        super(props);
    }

    state = {
        namedRoute: '',
        urlValue: this.props.seoData.url || '',
        locale: undefined,
        parameters: undefined,
        error: undefined,
        pageTitle: '',
        metaDesc: ''
    };

    _handleNamedRouteChange = (event) => {
        this.props.retrieveParameters({route: event.target.value})
            .then((response) => {
                this.setState({
                    name: response.name,
                    locale: response.locale,
                    parameters: response.parameters,
                    error: undefined
                });
            })
            .catch((response) => this.setState({
                locale: undefined,
                parameters: undefined,
                error: response.error
            }));

        this.setState({
            namedRoute: event.target.value
        });
    };

    _handleURLChange = (event) => {
        this.props.retrieveParameters({url: event.target.value})
            .then((response) => {
                this.setState({
                    name: response.name,
                    locale: response.locale,
                    parameters: response.parameters,
                    error: undefined
                });
            })
            .catch((response) => this.setState({
                locale: undefined,
                parameters: undefined,
                error: response.error
            }));

        this.setState({
            urlValue: event.target.value
        });
    };

    _handlePageTitleChange = (event) => {
        this.setState({
            pageTitle: event.target.value
        });
    };

    _handleMetaDescChange = (event) => {
        this.setState({
            metaDesc: event.target.value
        });
    };

    _handlePersistSeoData = (SeoData, event) => {
        event.preventDefault();

        if (!event.target.checkValidity()) {
            return;
        }

        const form = event.target;
        const data = new FormData(form);

        if (this.props.isNew) {
            data.append('seo_data[name]', this.state.name);
            data.append('seo_data[parameters]', this.state.parameters);
            data.append('seo_data[locale]', this.state.locale);
        }

        this.props.onPersistSeoData(this.props.isNew, SeoData, data);
    };

    render() {
        const parameters = this.props.isNew ? this.state.parameters : this.props.seoData.parameters;

        return (
            <form encType="multipart/form-data"
                  noValidate={true}
                  onSubmit={this._handlePersistSeoData.bind(this, this.props.seoData)}>
                {
                    this.props.isNew &&
                    <div className="row margin-top-25 margin-bottom-10">
                        <div className="col s12 center-align">
                            <h3>
                                {I18n.t('js.admin.seo.form.title')}
                            </h3>
                        </div>

                        <div className="col s12 margin-top-10 margin-bottom-10 center-align">
                            <FormControl className={this.props.classes.field}>
                                <InputLabel id="named-route">
                                    {I18n.t('js.admin.seo.form.select.route')}
                                </InputLabel>

                                <Select id="named-route"
                                        labelId="named-route-label"
                                        value={this.state.namedRoute}
                                        onChange={this._handleNamedRouteChange}>
                                    {
                                        this.props.seoPages.map((seoPage) => (
                                            <MenuItem key={seoPage}
                                                      value={seoPage}>
                                                {
                                                    this.props.seoPagesUsed.includes(seoPage)
                                                        ?
                                                        <strong>
                                                            {seoPage}
                                                        </strong>
                                                        :
                                                        seoPage
                                                }
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </div>

                        <div className="col s12">
                            <Separator text={I18n.t('js.admin.seo.form.select.or')}/>
                        </div>

                        <div className="col s12 center-align">
                            <TextField className={this.props.classes.field}
                                       label={I18n.t('js.admin.seo.form.select.url')}
                                       margin="normal"
                                       variant="outlined"
                                       value={this.state.urlValue}
                                       onChange={this._handleURLChange}/>
                        </div>
                    </div>
                }

                {
                    this.state.error &&
                    <h4 className={this.props.classes.errorField}>
                        {this.state.error}
                    </h4>
                }

                {
                    parameters &&
                    <div className="row margin-top-20 margin-bottom-20">
                        <div className="col s12 center-align">
                            <h3>
                                {I18n.t('js.admin.seo.form.seo_fields')}
                            </h3>
                        </div>

                        <div className="col s12 center-align">
                            {
                                parameters.length > 0
                                    ?
                                    <span className={this.props.classes.hint}>
                                        {I18n.t('js.admin.seo.form.parameters', {parameters: parameters.map((param) => `:${param}`).join(', ')})}
                                    </span>
                                    :
                                    <span className={this.props.classes.hint}>
                                        {I18n.t('js.admin.seo.form.no_parameters')}
                                    </span>
                            }
                        </div>

                        <div className="col s6 center-align">
                            <TextField className={this.props.classes.field}
                                       variant="outlined"
                                       margin="normal"
                                       name="seo_data[page_title]"
                                       label={I18n.t('js.admin.seo.form.page_title')}
                                       autoFocus={true}
                                       defaultValue={this.props.seoData.pageTitle}
                                       value={this.state.pageTitle}
                                       onChange={this._handlePageTitleChange}
                                       helperText={I18n.t('js.admin.seo.form.page_title_length', {count: this.state.pageTitle?.length})}/>
                        </div>

                        <div className="col s6 center-align">
                            <TextField className={this.props.classes.field}
                                       variant="outlined"
                                       multiline={true}
                                       margin="normal"
                                       name="seo_data[meta_desc]"
                                       label={I18n.t('js.admin.seo.form.meta_desc')}
                                       defaultValue={this.props.seoData.metaDesc}
                                       value={this.state.metaDesc}
                                       onChange={this._handleMetaDescChange}
                                       helperText={I18n.t('js.admin.seo.form.meta_desc_length', {count: this.state.metaDesc?.length})}/>
                        </div>

                        <div className="col s12 center-align form-actions margin-top-20 margin-bottom-25">
                            <Button className="margin-top-25"
                                    color="primary"
                                    variant="outlined"
                                    type="submit">
                                {
                                    this.props.isNew
                                        ?
                                        I18n.t('js.admin.seo.form.add')
                                        :
                                        I18n.t('js.admin.seo.form.update')
                                }
                            </Button>

                            <br/>
                            <br/>

                            <Button color="primary"
                                    variant="text"
                                    onClick={this.props.onCancel}>
                                {I18n.t('js.admin.seo.form.cancel')}
                            </Button>
                        </div>
                    </div>
                }
            </form>
        )
    }
}
