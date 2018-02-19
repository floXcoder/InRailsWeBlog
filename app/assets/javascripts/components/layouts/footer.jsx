'use strict';

// import {Link} from 'react-router-dom';

const FooterLayout = ({}) => (
    <div className="footer blog-footer">
        <div className="container">
            <div className="row">
                <div className="col l6 s12">
                    <h5 className="">
                        {I18n.t('js.views.footer.title')}
                    </h5>

                    <p className="">
                        {I18n.t('js.views.footer.description')}
                    </p>
                </div>

                <div className="col l4 offset-l2 s12">
                    <h5 className="">
                        {I18n.t('js.views.footer.links.title')}
                    </h5>

                    <p>
                        <a className=""
                           href="#">
                            {I18n.t('js.views.footer.links.about')}
                        </a>
                    </p>
                    <p>
                        <a className=""
                           href="#">
                            {I18n.t('js.views.footer.links.support')}
                        </a>
                    </p>
                    <p>
                        <a className=""
                           href={"mailto:" + window.settings.website_email}>
                            {I18n.t('js.views.footer.links.contact')}
                        </a>
                    </p>
                </div>

                <div className="col s12">
                    <div className="footer-copyright">
                        <a className=""
                           href={I18n.t('js.views.footer.links.github_src')}>
                            {I18n.t('js.views.footer.links.github')}
                        </a>

                        <div className="container center-align">
                            &copy; {I18n.t('js.views.footer.copyright', {version: window.revision})}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default FooterLayout;
