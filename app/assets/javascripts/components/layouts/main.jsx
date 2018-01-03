'use strict';

import {
    Route
} from 'react-router-dom';

import pasteManager from '../modules/pasteManager';

import UserManager from './managers/user';

import HeaderLayout from './header';
import SidebarLayout from './sidebar';
import FooterLayout from './footer';

@pasteManager
export default class MainLayout extends React.Component {
    static propTypes = {
        routes: PropTypes.object.isRequired,
        path: PropTypes.string.isRequired,
        component: PropTypes.func.isRequired,
        exact: PropTypes.bool,
        // From pasteManager
        onPaste: PropTypes.func
    };

    static defaultProps = {
        exact: false
    };

    constructor(props) {
        super(props);

        this._router = null;

        props.onPaste((content) => {
            if (this._router && this.props.path !== '/article/new' && this._router.location.hash !== '#new-article') {
                this._router.history.replace({
                    hash: '#new-article',
                    state: {article: {content: content, draft: true}}
                });
            }
        });
    }

    state = {
        isSidebarOpened: true
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
                   render={(router) => {
                       this._router = router;

                       return (
                           <UserManager>
                               <div className="blog-content">
                                   <HeaderLayout/>

                                   <SidebarLayout params={router.match.params}
                                                  onOpened={this._handleSidebarPinClick}/>

                                   <div
                                       className={classNames('blog-main-content', {'blog-main-pinned': this.state.isSidebarOpened})}>
                                       <div className="container blog-main">
                                           {
                                               this.props.routes.permanents.map((route, index) => (
                                                   <Route key={index}
                                                          children={({match, location}) => (
                                                              <div>
                                                                  {
                                                                      location.hash === `#${route.path}` &&
                                                                      <route.component params={match.params}
                                                                                       initialData={location.state}/>
                                                                  }
                                                              </div>
                                                          )}/>
                                               ))
                                           }

                                           <Component params={router.match.params}/>
                                       </div>

                                       <a className="goto-top hide-on-small-and-down"
                                          onClick={this._handleGoToTopClick}/>
                                   </div>

                                   <FooterLayout/>
                               </div>
                           </UserManager>
                       );
                   }
                   }/>
        );
    }
}
