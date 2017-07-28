'use strict';

import HeaderLayout from './header';
import SidebarLayout from './sidebar';
import FooterLayout from './footer';

import {
    Route
} from 'react-router-dom';

export default class DefaultLayout extends React.PureComponent {
    static propTypes = {
        component: React.PropTypes.func.isRequired,
        onReloadPage: React.PropTypes.func.isRequired
    };

    static defaultProps = {};

    state = {
        isSidebarOpened: true
    };

    constructor(props) {
        super(props);
    }

    // TODO
    // componentDidUpdate(prevProps) {
    //     if (this.props.location !== prevProps.location) {
    //         window.scrollTo(0, 0)
    //     }
    // }

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
        const {component: Component, ...rest} = this.props;

        return (
            <Route {...rest}
                   render={router => (
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

                           <FooterLayout />
                       </div>
                   )}/>
        );
    }
};

// const PostLayout = ({component: Component, ...rest}) => {
//     return (
//         <DefaultLayout {...rest} component={matchProps => (
//             <div className="Post">
//                 <div className="Post-content">
//                     <Component {...matchProps} />
//                 </div>
//                 <div className="Post-aside">
//                     <SomeSideBar />
//                 </div>
//             </div>
//         )} />
//     );
// };
