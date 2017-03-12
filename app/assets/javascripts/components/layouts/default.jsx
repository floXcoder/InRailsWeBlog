'use strict';

import TagSidebar from '../tags/sidebar';

import HeaderLayout from './header';
import FooterLayout from './footer';

import {
    Route
} from 'react-router-dom';

const DefaultLayout = ({component: Component, ...rest}) => {
    return (
        <Route {...rest}
               render={matchProps => (
                   <div className="row">
                       <HeaderLayout />

                       <div className="col s3">
                           <div className="blog-sidebar">
                               <TagSidebar />
                           </div>
                       </div>

                       <div className="col s9">
                           <div className="container blog-main">
                               <Component {...matchProps}/>
                           </div>

                           <a className="goto-top hide-on-small-and-down"
                              onClick={_handleGoToTopClick}/>
                       </div>

                       <FooterLayout />
                   </div>
               )}/>
    )
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

const _handleGoToTopClick = (event) => {
    event.preventDefault();
    window.scrollTo(0, 0);
    return false;
};

DefaultLayout.propTypes = {
    component: React.PropTypes.func.isRequired
};

DefaultLayout.defaultProps = {};

export default DefaultLayout;
