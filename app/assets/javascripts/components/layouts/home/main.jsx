'use strict';

import {
    Suspense
} from 'react';

import {
    Switch,
    Route
} from 'react-router-dom';

import {
    withStyles
} from '@material-ui/core/styles';

import styles from '../../../../jss/home/main';

export default @withStyles(styles)
class MainLayoutHome extends React.Component {
    static propTypes = {
        routes: PropTypes.array.isRequired,
        permanentRoutes: PropTypes.array.isRequired,
        // from styles
        classes: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        return false;
    }

    _renderPermanentRoutes = (routes) => {
        return routes.map((route, index) => (
            <Route key={index}
                   children={({match, location, history}) => {
                       const Component = route.component();

                       return (
                           <div>
                               {
                                   location.hash === `#${route.path}` &&
                                   <Component params={match.params}
                                              history={history}
                                              initialData={location.state}/>
                               }
                           </div>
                       );
                   }}/>
        ));
    };

    render() {
        // In development environment with hot reload:
        // React Suspense or Memo use context that cause a re-render without calling shouldComponentUpdate
        // So some route (like ArticleIndex) are called 4 times!

        return (
            <Switch>
                {
                    this.props.routes.map((route) => (
                        <Route key={route.path}
                               path={route.path}
                               exact={route.exact}
                               render={(router) => {
                                   const Component = route.component();

                                   return (
                                       <main className={classNames(this.props.classes.content)}>
                                           <Suspense fallback={<div/>}>
                                               <div className={this.props.classes.layout}>
                                                   {
                                                       this._renderPermanentRoutes(this.props.permanentRoutes)
                                                   }

                                                   <Component params={router.match.params}
                                                              queryString={router.location.search}
                                                              history={router.history}
                                                              initialData={router.location.state}/>
                                               </div>
                                           </Suspense>
                                       </main>
                                   )
                               }}/>
                    ))
                }
            </Switch>
        );
    }
}
