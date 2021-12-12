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
        locale: this.props.seoData.locale || undefined,
        parameters: this.props.seoData.parameters || undefined,
        url: undefined,
        pageTitle: this.props.seoData.pageTitle || '',
        metaDesc: this.props.seoData.metaDesc || '',
        error: undefined
    };

    _handleRouteChange = (type, event) => {
        this.props.retrieveParameters({route: event.target.value})
            .then((response) => {
                this.setState({
                    name: response.name,
                    locale: response.locale,
                    parameters: response.parameters,
                    url: response.url,
                    error: undefined
                });
            })
            .catch((response) => this.setState({
                locale: undefined,
                parameters: undefined,
                error: response.error
            }));

        this.setState({
            [type]: event.target.value
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
                            <FormControl className="admin-seo-field">
                                <InputLabel id="named-route">
                                    {I18n.t('js.admin.seo.form.select.route')}
                                </InputLabel>

                                <Select id="named-route"
                                        labelId="named-route-label"
                                        value={this.state.namedRoute}
                                        onChange={this._handleRouteChange.bind(this, 'namedRoute')}>
                                    {
                                        this.props.seoPages.filter((s) => !this.props.seoPagesUsed.includes(s.name)).map((seoPage) => (
                                            <MenuItem key={seoPage.name}
                                                      value={seoPage.name}>
                                                {seoPage.name}
                                                {' '}
                                                (
                                                {I18n.t(`js.admin.seo.visibility.${seoPage.params.public ? 'public' : 'private'}`)}
                                                )
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
                            <TextField className="admin-seo-field"
                                       label={I18n.t('js.admin.seo.form.select.url')}
                                       margin="normal"
                                       variant="outlined"
                                       value={this.state.urlValue}
                                       onChange={this._handleRouteChange.bind(this, 'urlValue')}/>
                        </div>
                    </div>
                }

                {
                    this.state.error &&
                    <h4 className="admin-seo-errorField">
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

                        {
                            this.state.url &&
                            <div className="col s12 center-align margin-bottom-15">
                                URL :
                                {' '}
                                {this.state.url}
                            </div>
                        }

                        <div className="col s12 center-align">
                            {
                                parameters.length > 0
                                    ?
                                    <span className="admin-seo-hint">
                                        {I18n.t('js.admin.seo.form.parameters', {parameters: parameters.map((param) => `:${param}`).join(', ')})}
                                    </span>
                                    :
                                    <span className="admin-seo-hint">
                                        {I18n.t('js.admin.seo.form.no_parameters')}
                                    </span>
                            }
                        </div>

                        <div className="col s6 center-align">
                            <TextField className="admin-seo-field"
                                       variant="outlined"
                                       margin="normal"
                                       name="seo_data[page_title]"
                                       label={I18n.t('js.admin.seo.form.page_title')}
                                       autoFocus={true}
                                       required={true}
                                       value={this.state.pageTitle}
                                       onChange={this._handlePageTitleChange}
                                       helperText={I18n.t('js.admin.seo.form.page_title_length', {
                                           count: this.state.pageTitle?.length,
                                           max: window.settings.seo_title_length
                                       })}/>
                        </div>

                        <div className="col s6 center-align">
                            <TextField className="admin-seo-field"
                                       variant="outlined"
                                       multiline={true}
                                       required={true}
                                       margin="normal"
                                       name="seo_data[meta_desc]"
                                       label={I18n.t('js.admin.seo.form.meta_desc')}
                                       value={this.state.metaDesc}
                                       onChange={this._handleMetaDescChange}
                                       helperText={I18n.t('js.admin.seo.form.meta_desc_length', {
                                           count: this.state.metaDesc?.length,
                                           max: window.settings.seo_meta_desc_length
                                       })}/>
                        </div>

                        <div className="col s12 center-align margin-top-20 margin-bottom-25">
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
        );
    }
}
