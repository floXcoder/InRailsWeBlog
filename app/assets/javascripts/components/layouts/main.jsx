'use strict';

import {
    Route,
    Link
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
            if (content && this._router && this.props.path !== '/article/new' && this._router.location.hash !== '#new-article') {
                const isURL = $.isURL(content.trim());

                let articleData = {};
                if (isURL) {
                    articleData.reference = content.trim();
                } else {
                    articleData.content = content
                }

                this._router.history.replace({
                    hash: '#new-article',
                    state: {
                        article: articleData,
                        mode: isURL ? 'link' : 'story',
                        isDraft: true
                    }
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
                           <UserManager routerState={router.location.state}>
                               <div className="blog-content">
                                   <HeaderLayout/>

                                   <SidebarLayout params={router.match.params}
                                                  onOpened={this._handleSidebarPinClick}/>

                                   <div
                                       className={classNames('blog-main-content', {
                                           'blog-main-pinned': this.state.isSidebarOpened
                                       })}>
                                       <div className="container blog-main">
                                           {
                                               this.props.routes.permanents.map((route, index) => (
                                                   <Route key={index}
                                                          children={({match, location, history}) => (
                                                              <div>
                                                                  {
                                                                      location.hash === `#${route.path}` &&
                                                                      <route.component params={match.params}
                                                                                       history={history}
                                                                                       initialData={location.state}/>
                                                                  }
                                                              </div>
                                                          )}/>
                                               ))
                                           }

                                           <Component params={router.match.params}
                                                      history={router.history}
                                                      initialData={router.location.state}/>
                                       </div>

                                       {
                                           (router.match.params.tagSlug || router.match.params.parentTagSlug || router.match.params.childTagSlug) &&
                                           <Link className="article-quick-add"
                                                 to={{
                                                     hash: '#new-article',
                                                     state: {
                                                         mode: 'note',
                                                         parentTagSlug: router.match.params.parentTagSlug || router.match.params.tagSlug,
                                                         childTagSlug: router.match.params.childTagSlug
                                                     }
                                                 }}>
                                               <span className="material-icons"
                                                     data-icon="add_circle_outline"
                                                     aria-hidden="true"/>
                                           </Link>
                                       }

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
