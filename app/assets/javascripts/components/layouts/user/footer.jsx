'use strict';

import {
    withRouter
} from 'react-router-dom';

// import {
//     withStyles
// } from '@material-ui/core/styles';
//
// import styles from '../../../../jss/user/footer';

export default @withRouter
// @withStyles(styles)
class FooterLayoutUser extends React.Component {
    static propTypes = {
        // from router
        location: PropTypes.object,
        history: PropTypes.object,
        // from styles
        // classes: PropTypes.object
    };

    _handleSearchClose = () => {
        if (this.props.location.hash === '#search') {
            this.props.history.push({
                hash: undefined
            });
        }
    };

    _handleCoverClick = (event) => {
        event.preventDefault();

        this._handleSearchClose();
    };

    render() {
        const isSearchActive = this.props.location.hash === '#search';

        return (
            <>
                <div className={classNames('blog-cover-layer', {
                    'search-form-visible': isSearchActive
                })}
                     onClick={this._handleCoverClick}/>

                {/*<Grid className={this.props.classes.footer}*/}
                      {/*container={true}*/}
                      {/*direction="row"*/}
                      {/*justify="space-around"*/}
                      {/*alignItems="stretch">*/}
                    {/*<Grid item={true}*/}
                          {/*md={6}>*/}
                        {/*<h5>*/}
                            {/*{I18n.t('js.views.footer.title')}*/}
                        {/*</h5>*/}

                        {/*<p>*/}
                            {/*{I18n.t('js.views.footer.description')}*/}
                        {/*</p>*/}
                    {/*</Grid>*/}

                    {/*<Grid item={true}*/}
                          {/*md={6}>*/}
                        {/*<h5>*/}
                            {/*{I18n.t('js.views.footer.links.title')}*/}
                        {/*</h5>*/}

                        {/*<p>*/}
                            {/*<Link to='#'>*/}
                                {/*{I18n.t('js.views.footer.links.about')}*/}
                            {/*</Link>*/}
                        {/*</p>*/}
                        {/*<p>*/}
                            {/*<Link to='#'>*/}
                                {/*{I18n.t('js.views.footer.links.support')}*/}
                            {/*</Link>*/}
                        {/*</p>*/}
                        {/*<p>*/}
                            {/*<a href={"mailto:" + window.settings.website_email}>*/}
                                {/*{I18n.t('js.views.footer.links.contact')}*/}
                            {/*</a>*/}
                        {/*</p>*/}
                    {/*</Grid>*/}

                    {/*<Grid item={true}*/}
                          {/*xs={6}>*/}
                        {/*<div className="footer-copyright">*/}
                            {/*<a href={I18n.t('js.views.footer.links.github_src')}>*/}
                                {/*{I18n.t('js.views.footer.links.github')}*/}
                            {/*</a>*/}

                            {/*<div className="container center-align">*/}
                                {/*&copy; {I18n.t('js.views.footer.copyright', {version: window.revision})}*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</Grid>*/}
                {/*</Grid>*/}
            </>
        );
    }
}
