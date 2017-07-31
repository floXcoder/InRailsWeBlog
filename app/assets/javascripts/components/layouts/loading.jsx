'use strict';

// import HeaderLayout from './header';
// import FooterLayout from './footer';

// TODO: loader
import {
    Dimmer,
    Loader,
    Image,
    Segment
} from 'semantic-ui-react'

// import {
//     Route
// } from 'react-router-dom';

const LoadingLayout = ({component: Component, ...rest}) => {
    return (
        <div className="row">
            <header className="blog-header">
                <div className="navbar-fixed">
                    <nav>
                        <div className="nav-wrapper"/>
                    </nav>
                </div>
            </header>

            <div className="col s3">
                <div className="blog-sidebar">
                    {/*<Segment>*/}
                    {/*<Dimmer active*/}
                    {/*inverted>*/}
                    {/*<Loader inverted*/}
                    {/*content='Loading'/>*/}
                    {/*</Dimmer>*/}

                    {/*<Image src='/assets/images/wireframe/short-paragraph.png' />*/}
                    {/*</Segment>*/}
                </div>
            </div>

            <div className="col s9">
                <div className="container blog-main">
                    {
                        Component &&
                        <Component {...rest}/>
                    }
                </div>
            </div>
        </div>
    )
};

LoadingLayout.propTypes = {
    component: PropTypes.func
};

LoadingLayout.defaultProps = {
    component: null
};

export default LoadingLayout;
