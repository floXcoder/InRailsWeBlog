'use strict';

require('../../application');

// Flash messages
$('.blog-flash').each(function() {
    var $this = $(this);
    Materialize.toast($this.html(), 3000);
});

$(document).ajaxComplete(function (event, request) {
    if (request.getResponseHeader('X-Flash-Messages')) {
        var flashMessage = JSON.parse(decodeURIComponent(escape(request.getResponseHeader('X-Flash-Messages'))));

        if(flashMessage && flashMessage.success) {
            Materialize.toast(flashMessage.success, 3000);
        }

        if(flashMessage && flashMessage.notice) {
            Materialize.toast(flashMessage.notice, 3000);
        }

        if(flashMessage && flashMessage.error) {
            Materialize.toast(flashMessage.error, 3000);
        }
    }
});

// Burger Menu
var BurgerMenu = require('react-burger-menu').scaleDown;
var HeaderMenu = React.createClass({
    //showSettings: function(event) {
    //    event.preventDefault();
    //},

    render: function() {
        return (
            <BurgerMenu pageWrapId="page-wrap" outerContainerId="outer-container">
                <a className="menu-item"
                   href="/admin">
                    <i className="material-icons">dashboard</i>
                    {I18n.t('js.admin.menu.dashboard')}
                </a>
                <a className="menu-item"
                   href="/admin/users_manager">
                    <i className="material-icons">account_circle</i>
                    {I18n.t('js.admin.menu.users')}
                </a>
                <a className="menu-item"
                   href="/admin/errors">
                    <i className="material-icons">error</i>
                    {I18n.t('js.admin.menu.errors')}
                </a>
                <a className="menu-item"
                   href="/admin/sidekiq">
                    <i className="material-icons">subscriptions</i>
                    {I18n.t('js.admin.menu.sidekiq')}
                </a>
                <a className="menu-item"
                   href="/">
                    <i className="material-icons">arrow_back</i>
                    {I18n.t('js.admin.menu.back_home')}
                </a>
            </BurgerMenu>
        );

        //<a onClick={ this.showSettings }
        //   className="menu-item--small"
        //   href="">
        //    Settings
        //</a>
    }
});


ReactDOM.render(
    <HeaderMenu/>,
    document.getElementById('burger-menu-component')
);



//let currentUserId = window.currentUserId === 'null' ? null : parseInt(window.currentUserId, 10);
