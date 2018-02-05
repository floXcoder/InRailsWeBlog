'use strict';

import {
    Dimmer,
    Loader
} from 'semantic-ui-react'

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
                <Dimmer active={true}
                        inverted={true}>
                    <Loader inverted={true}>
                        {I18n.t('js.views.home.loader')}
                    </Loader>
                </Dimmer>
            </div>
        </div>

        <div className="col s9">
            <div className="container blog-main">
                <Dimmer active={true}
                        inverted={true}>
                    <Loader inverted={true}
                            size="large">
                        {I18n.t('js.views.home.loader')}
                    </Loader>
                </Dimmer>

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
