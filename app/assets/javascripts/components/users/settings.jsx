'use strict';

import {
    updateUserSettings
} from '../../actions';

import RadioButtons from '../materialize/radioButtons';
import SwitchButton from '../materialize/switchButton';

import {
    Tabs,
    Tab
} from '../theme/tab';

@connect((state) => ({
    currentUserId: state.userState.currentId,
    user: state.userState.user,
    settings: state.userState.user.settings,
    articlesLoader: state.userState.user && state.userState.user.settings.articlesLoader,
    articleDisplay: state.userState.user && state.userState.user.settings.articleDisplay,
    articleChildTagged: state.userState.user && state.userState.user.settings.articleChildTagged,
    tagSidebarPin: state.userState.user && state.userState.user.settings.tagSidebarPin,
    tagSidebarWithChild: state.userState.user && state.userState.user.settings.tagSidebarWithChild,
    tagOrder: state.userState.user && state.userState.user.settings.tagOrder,
    searchHighlight: state.userState.user && state.userState.user.searchHighlight,
    searchOperator: state.userState.user && state.userState.user.settings.searchOperator,
    searchExact: state.userState.user && state.userState.user.settings.searchExact
}), {
    updateUserSettings
})
export default class UserSettings extends React.Component {
    static propTypes = {
        // From connect
        currentUserId: PropTypes.number,
        articlesLoader: PropTypes.string,
        articleDisplay: PropTypes.string,
        articleChildTagged: PropTypes.bool,
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

    _onLoaderChanged = (event) => {
        this._updateSettings({articlesLoader: event.target.id});
    };

    _onDisplayChanged = (event) => {
        this._updateSettings({articleDisplay: event.target.id});
    };

    _onChildTaggedChanged = (value) => {
        this._updateSettings({articleChildTagged: value});
    };

    _onTagSidebarPinChanged = (value) => {
        this._updateSettings({tagSidebarPin: value});
    };

    _onTagSidebarWithChildChanged = (value) => {
        this._updateSettings({tagSidebarWithChild: value});
    };

    _onTagOrderModeChanged = (event) => {
        this._updateSettings({tagOrder: event.target.id});
    };

    _onHighlightChanged = (value) => {
        this._updateSettings({searchHighlight: value});
    };

    _onOperatorSearchChanged = (event) => {
        this._updateSettings({searchOperator: event.target.id});
    };

    _onExactSearchChanged = (value) => {
        this._updateSettings({searchExact: value});
    };

    _updateSettings = (setting) => {
        this.props.updateUserSettings(this.props.currentUserId, setting);
    };

    render() {
        return (
            <Tabs>
                <Tab header={I18n.t('js.user.settings.article.title')}>
                    <div className="row">
                        <div className="col s12">
                            <h6>
                                {I18n.t('js.user.settings.article.loader.title')}
                            </h6>

                            <RadioButtons group="articlesLoader"
                                          buttons={I18n.t('js.user.settings.article.loader.mode')}
                                          checkedButton={this.props.articlesLoader}
                                          onChange={this._onLoaderChanged}/>
                        </div>
                        <div className="col s12 margin-top-15">
                            <h6>
                                {I18n.t('js.user.settings.article.display.title')}
                            </h6>

                            <RadioButtons group="articleDisplay"
                                          buttons={I18n.t('js.user.settings.article.display.mode')}
                                          checkedButton={this.props.articleDisplay}
                                          onChange={this._onDisplayChanged}/>
                        </div>
                        <div className="col s12 margin-top-15">
                            <SwitchButton id="article-child-tagged"
                                          title={I18n.t('js.user.settings.article.child_tagged.title')}
                                          values={I18n.t('js.checkbox')}
                                          onChange={this._onChildTaggedChanged}>
                                {this.props.articleChildTagged}
                            </SwitchButton>
                        </div>
                    </div>
                </Tab>

                <Tab header={I18n.t('js.user.settings.tag.title')}>
                    <div className="row">
                        <div className="col s12">
                            <h6>
                                {I18n.t('js.user.settings.tag.sidebar.title')}
                            </h6>

                            <SwitchButton id="tag-sidebar-pin"
                                          title={I18n.t('js.user.settings.tag.sidebar.pin')}
                                          values={I18n.t('js.checkbox')}
                                          onChange={this._onTagSidebarPinChanged}>
                                {this.props.tagSidebarPin}
                            </SwitchButton>

                            <SwitchButton id="tag-sidebar-child"
                                          title={I18n.t('js.user.settings.tag.sidebar.with_child')}
                                          values={I18n.t('js.checkbox')}
                                          onChange={this._onTagSidebarWithChildChanged}>
                                {this.props.tagSidebarWithChild}
                            </SwitchButton>
                        </div>

                        <div className="col s12 margin-top-15">
                            <h6>
                                {I18n.t('js.user.settings.tag.order.title')}
                            </h6>

                            <RadioButtons group="tagOrder"
                                          buttons={I18n.t('js.user.settings.tag.order.mode')}
                                          checkedButton={this.props.tagOrder}
                                          onChange={this._onTagOrderModeChanged}/>
                        </div>
                    </div>
                </Tab>

                <Tab header={I18n.t('js.user.settings.search.title')}>
                    <div className="row">
                        <div className="col s12">
                            <h6>
                                {I18n.t('js.user.settings.search.operator.title')}
                            </h6>

                            <RadioButtons group="searchOperator"
                                          buttons={I18n.t('js.user.settings.search.operator.mode')}
                                          checkedButton={this.props.searchOperator}
                                          onChange={this._onOperatorSearchChanged}/>
                        </div>

                        <div className="col s12 margin-top-15">
                            <SwitchButton id="search-highlight"
                                          title={I18n.t('js.user.settings.search.highlight')}
                                          values={I18n.t('js.checkbox')}
                                          onChange={this._onHighlightChanged}>
                                {this.props.searchHighlight}
                            </SwitchButton>
                        </div>

                        <div className="col s12 margin-top-15">
                            <SwitchButton id="search-exact"
                                          title={I18n.t('js.user.settings.search.exact')}
                                          values={I18n.t('js.checkbox')}
                                          onChange={this._onExactSearchChanged}>
                                {this.props.searchExact}
                            </SwitchButton>
                        </div>
                    </div>
                </Tab>
            </Tabs>
        );
    }
}
