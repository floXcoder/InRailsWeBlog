'use strict';

import {
    updateUserSettings
} from '../../actions';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';

const PREFERENCE_VIEWS = {
    ARTICLES: 0,
    TAGS: 1,
    SEARCH: 2
};

export default @connect((state) => ({
    currentUserId: state.userState.currentId,
    userPreferenceView: state.uiState.userPreferenceView,
    articlesLoader: state.userState.user?.settings?.articlesLoader,
    articleOrder: state.userState.user?.settings?.articleOrder,
    articleDisplay: state.userState.user?.settings?.articleDisplay,
    articleMultilanguage: state.userState.user?.settings?.articleMultilanguage,
    tagParentAndChild: state.userState.user?.settings?.tagParentAndChild,
    tagSidebarPin: state.userState.user?.settings?.tagSidebarPin,
    tagSidebarWithChild: state.userState.user?.settings?.tagSidebarWithChild,
    tagOrder: state.userState.user?.settings?.tagOrder,
    searchHighlight: state.userState.user?.settings?.searchHighlight,
    searchOperator: state.userState.user?.settings?.searchOperator,
    searchExact: state.userState.user?.settings?.searchExact
}), {
    updateUserSettings
})
class UserSettings extends React.Component {
    static propTypes = {
        // from connect
        currentUserId: PropTypes.number,
        userPreferenceView: PropTypes.string,
        articlesLoader: PropTypes.string,
        articleOrder: PropTypes.string,
        articleDisplay: PropTypes.string,
        articleMultilanguage: PropTypes.bool,
        tagParentAndChild: PropTypes.bool,
        tagSidebarPin: PropTypes.bool,
        tagSidebarWithChild: PropTypes.bool,
        tagOrder: PropTypes.string,
        searchHighlight: PropTypes.bool,
        searchOperator: PropTypes.string,
        searchExact: PropTypes.bool,
        updateUserSettings: PropTypes.func
    };

    constructor(props) {
        super(props);
    }

    state = {
        tabIndex: PREFERENCE_VIEWS[this.props.userPreferenceView || 'ARTICLES'],
        articlesLoader: this.props.articlesLoader,
        articleOrder: this.props.articleOrder,
        articleDisplay: this.props.articleDisplay,
        articleMultilanguage: this.props.articleMultilanguage,
        tagParentAndChild: this.props.tagParentAndChild,
        tagSidebarPin: this.props.tagSidebarPin,
        tagSidebarWithChild: this.props.tagSidebarWithChild,
        tagOrder: this.props.tagOrder,
        searchHighlight: this.props.searchHighlight,
        searchOperator: this.props.searchOperator,
        searchExact: this.props.searchExact
    };

    _handleTabChange = (event, value) => {
        this.setState({tabIndex: value});
    };

    _updateSettings = (setting) => {
        this.props.updateUserSettings(this.props.currentUserId, setting);
    };

    _onSettingRadioChange = (setting, event) => {
        this.setState({
            [setting]: event.target.value
        });

        this._updateSettings({[setting]: event.target.value});
    };

    _onSettingSwitchChange = (setting, event) => {
        this.setState({
            [setting]: event.target.checked
        });

        this._updateSettings({[setting]: event.target.checked});
    };

    render() {
        return (
            <div>
                <Tabs value={this.state.tabIndex}
                      onChange={this._handleTabChange}
                      indicatorColor="primary"
                      variant="fullWidth">
                    <Tab label={I18n.t('js.user.settings.article.title')}
                         disableRipple={true}/>

                    <Tab label={I18n.t('js.user.settings.tag.title')}
                         disableRipple={true}/>

                    <Tab label={I18n.t('js.user.settings.search.title')}
                         disableRipple={true}/>
                </Tabs>

                {
                    this.state.tabIndex === PREFERENCE_VIEWS.ARTICLES &&
                    <div className="row margin-top-5">
                        <div className="col s12 margin-top-15">
                            <FormControl className="margin-top-20"
                                         component="fieldset">
                                <FormLabel className="margin-bottom-10"
                                           component="legend">
                                    {I18n.t('js.user.settings.article.display.title')}
                                </FormLabel>

                                <RadioGroup aria-label="Display article"
                                            name="display"
                                            value={this.state.articleDisplay}
                                            onChange={this._onSettingRadioChange.bind(this, 'articleDisplay')}>
                                    {
                                        Object.keys(I18n.t('js.user.settings.article.display.mode')).map((key) => (
                                            <FormControlLabel key={key}
                                                              value={key}
                                                              control={<Radio/>}
                                                              label={I18n.t('js.user.settings.article.display.mode')[key]}/>
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>
                        </div>

                        <div className="col s12 margin-top-25">
                            <FormControl component="fieldset">
                                <FormLabel className="margin-bottom-10"
                                           component="legend">
                                    {I18n.t('js.user.settings.article.order.title')}
                                </FormLabel>

                                <RadioGroup aria-label="order"
                                            name="order"
                                            value={this.state.articleOrder}
                                            onChange={this._onSettingRadioChange.bind(this, 'articleOrder')}>
                                    {
                                        Object.keys(I18n.t('js.user.settings.article.order.mode')).map((key) => (
                                            <FormControlLabel key={key}
                                                              value={key}
                                                              control={<Radio/>}
                                                              label={I18n.t('js.user.settings.article.order.mode')[key]}/>
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>
                        </div>

                        <div className="col s12 margin-top-25">
                            <FormControl component="fieldset">
                                <FormLabel className="margin-bottom-10"
                                           component="legend">
                                    {I18n.t('js.user.settings.article.loader.title')}
                                </FormLabel>

                                <RadioGroup aria-label="Loader"
                                            name="loader"
                                            value={this.state.articlesLoader}
                                            onChange={this._onSettingRadioChange.bind(this, 'articlesLoader')}>
                                    {
                                        Object.keys(I18n.t('js.user.settings.article.loader.mode')).map((key) => (
                                            <FormControlLabel key={key}
                                                              value={key}
                                                              control={<Radio/>}
                                                              label={I18n.t('js.user.settings.article.loader.mode')[key]}/>
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>
                        </div>

                        <div className="col s12 margin-top-25">
                            <FormLabel className="margin-bottom-10"
                                       component="legend">
                                {I18n.t('js.user.settings.article.multilanguage.title')}
                            </FormLabel>

                            <FormControlLabel label={I18n.t('js.user.settings.article.multilanguage.name')}
                                              control={
                                                  <Switch checked={this.state.articleMultilanguage}
                                                          onChange={this._onSettingSwitchChange.bind(this, 'articleMultilanguage')}/>
                                              }/>
                        </div>

                        <div className="col s12 margin-top-25">
                            <FormLabel className="margin-bottom-10"
                                       component="legend">
                                {I18n.t('js.user.settings.article.export.title')}
                            </FormLabel>

                            <Button className="margin-top-15"
                                    variant="outlined"
                                    component="a"
                                    size="small"
                                    href={`/api/v1/exporter.zip?user_id=${this.props.currentUserId}`}>
                                {I18n.t('js.user.settings.article.export.button')}
                            </Button>
                        </div>
                    </div>
                }

                {
                    this.state.tabIndex === PREFERENCE_VIEWS.TAGS &&
                    <div className="row margin-top-5">
                        <div className="col s12">
                            <FormLabel className="margin-bottom-10"
                                       component="legend">
                                {I18n.t('js.user.settings.tag.sidebar.title')}
                            </FormLabel>

                            <FormControlLabel label={I18n.t('js.user.settings.tag.sidebar.pin')}
                                              control={
                                                  <Switch checked={this.state.tagSidebarPin}
                                                          onChange={this._onSettingSwitchChange.bind(this, 'tagSidebarPin')}/>
                                              }/>

                            <FormControlLabel label={I18n.t('js.user.settings.tag.sidebar.with_child')}
                                              control={
                                                  <Switch checked={this.state.tagSidebarWithChild}
                                                          onChange={this._onSettingSwitchChange.bind(this, 'tagSidebarWithChild')}/>
                                              }/>

                            <FormControlLabel label={I18n.t('js.user.settings.tag.parent_and_child')}
                                              control={
                                                  <Switch checked={this.state.tagParentAndChild}
                                                          onChange={this._onSettingSwitchChange.bind(this, 'tagParentAndChild')}/>
                                              }/>

                        </div>

                        <div className="col s12 margin-top-25">
                            <FormControl className="margin-top-20"
                                         component="fieldset">
                                <FormLabel className="margin-bottom-10"
                                           component="legend">
                                    {I18n.t('js.user.settings.tag.order.title')}
                                </FormLabel>

                                <RadioGroup aria-label="Tag order"
                                            name="tag_order"
                                            value={this.state.tagOrder}
                                            onChange={this._onSettingRadioChange.bind(this, 'tagOrder')}>
                                    {
                                        Object.keys(I18n.t('js.user.settings.tag.order.mode')).map((key) => (
                                            <FormControlLabel key={key}
                                                              value={key}
                                                              control={<Radio/>}
                                                              label={I18n.t('js.user.settings.tag.order.mode')[key]}/>
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </div>
                }

                {
                    this.state.tabIndex === PREFERENCE_VIEWS.SEARCH &&
                    <div className="row margin-top-5">
                        <div className="col s12">
                            <FormControl className="margin-top-20"
                                         component="fieldset">
                                <FormLabel className="margin-bottom-10"
                                           component="legend">
                                    {I18n.t('js.user.settings.search.operator.title')}
                                </FormLabel>

                                <RadioGroup aria-label="Search operand"
                                            name="search_operator"
                                            value={this.state.searchOperator}
                                            onChange={this._onSettingRadioChange.bind(this, 'searchOperator')}>
                                    {
                                        Object.keys(I18n.t('js.user.settings.search.operator.mode')).map((key) => (
                                            <FormControlLabel key={key}
                                                              value={key}
                                                              control={<Radio/>}
                                                              label={I18n.t('js.user.settings.search.operator.mode')[key]}/>
                                        ))
                                    }
                                </RadioGroup>
                            </FormControl>
                        </div>

                        <div className="col s12 margin-top-25">
                            <FormLabel className="margin-bottom-10"
                                       component="legend">
                                {I18n.t('js.user.settings.search.options')}
                            </FormLabel>

                            <FormControlLabel label={I18n.t('js.user.settings.search.highlight')}
                                              control={
                                                  <Switch checked={this.state.searchHighlight}
                                                          onChange={this._onSettingSwitchChange.bind(this, 'searchHighlight')}/>
                                              }/>
                        </div>

                        <div className="col s12 margin-top-25">
                            <FormControlLabel label={I18n.t('js.user.settings.search.exact')}
                                              control={
                                                  <Switch checked={this.state.searchExact}
                                                          onChange={this._onSettingSwitchChange.bind(this, 'searchExact')}/>
                                              }/>
                        </div>
                    </div>
                }
            </div>
        );
    }
}
