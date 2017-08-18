'use strict';

import TopicStore from '../../stores/topicStore';

import HeaderLayout from './header';
import SidebarLayout from './sidebar';
import FooterLayout from './footer';

import {
    Route
} from 'react-router-dom';

import ClipboardManager from '../../modules/clipboard';
import SanitizePaste from '../../modules/wysiwyg/sanitize-paste';

export default class DefaultLayout extends Reflux.PureComponent {
    static propTypes = {
        path: PropTypes.string.isRequired,
        component: PropTypes.func.isRequired,
        onReloadPage: PropTypes.func.isRequired,
        exact: PropTypes.bool
    };

    static defaultProps = {
        exact: false
    };

    constructor(props) {
        super(props);

        this._router = null;

        this.mapStoreToState(TopicStore, this.onTopicChange);
    }

    state = {
        isSidebarOpened: true
    };

    componentDidMount() {
        this._onInit();
    }

    onTopicChange(topicData) {
        if ($.isEmpty(topicData)) {
            return;
        }

        // let newState = {};

        if (topicData.type === 'switchTopic' || topicData.type === 'addTopic') {
            this._router.history.push(`/topic/${topicData.topic.slug}`);
        }

        // if (!$.isEmpty(newState)) {
        //     this.setState(newState);
        // }
    }

    _onInit = () => {
        ClipboardManager.initialize(this._onPaste);
    };

    _onPaste = (content) => {
        if (this._router && this.props.path !== '/article/new') {
            this._router.history.push({
                pathname: '/article/new',
                state: {article: {content: SanitizePaste.parse(content), draft: true}}
            });
        }
    };

    _handleSidebarPinClick = (isPinned) => {
        this.setState({
            isSidebarOpened: isPinned
        });
    };

    _handleGoToTopClick = (event) => {
        event.preventDefault();
        window.scrollTo(0, 0);
    };

    render() {
        const {component: Component, ...props} = this.props;

        return (
            <Route {...props}
                   render={router => {
                       this._router = router;

                       return (
                           <div className="blog-content">
                               <HeaderLayout router={router}
                                             onReloadPage={this.props.onReloadPage}/>

                               <SidebarLayout router={router}
                                              onOpened={this._handleSidebarPinClick}/>

                               <div
                                   className={classNames('blog-main-content', {'blog-main-pinned': this.state.isSidebarOpened})}>
                                   <div className="container blog-main">
                                       <Component router={router}/>
                                   </div>

                                   <a className="goto-top hide-on-small-and-down"
                                      onClick={this._handleGoToTopClick}/>
                               </div>

                               <FooterLayout/>
                           </div>
                       );
                   }}/>
        );
    }
};
