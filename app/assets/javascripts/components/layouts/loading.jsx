'use strict';

import Spinner from '../materialize/spinner';

const LoadingLayout = ({component: Component, ...rest}) => (
    <div className="row">
        <header className="blog-header">
            <div className="navbar-fixed">
                <nav>
                    <div className="nav-wrapper"/>
                </nav>
            </div>
        </header>

        <div className="col s3">
            <div className="sidebar sidebar-pin">
                <div className="center margin-top-20">
                    <Spinner size="big"/>

                    {I18n.t('js.views.home.loader')}
                </div>
            </div>
        </div>

        <div className="col s9">
            <div className="container blog-main">
                <div className="center margin-top-20">
                    <Spinner size="big"/>

                    {I18n.t('js.views.home.loader')}
                </div>

                {
                    Component &&
                    <Component {...rest}/>
                }
            </div>
        </div>
    </div>
);

LoadingLayout.propTypes = {
    component: PropTypes.func
};

export default LoadingLayout;
