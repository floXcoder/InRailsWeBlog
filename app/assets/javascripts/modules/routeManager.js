'use strict';

// Build routes from translated routes in locales/routes.*.yml

const RouteManager = (function () {
    const routeManager = RouteManager.prototype;

    function RouteManager() {
        this._model = {
            localizedRoutes: {}
        };

        /* Private Methods
         ******************** */
        this._buildRoute = function (locale, path) {
            return path.split('/').map((p) => this._model.localizedRoutes[locale][p] || p).join('/').replace(/^(.+?)\/*?$/, '$1') || '/';
        }

        this._buildRoutes = function (path) {
            return  window.locales.map((l) => [this._model.localizedRoutes[l].locale].concat(path.substr(1).split('/').map((p) => p.includes('|') ? '(' + p.substr(1).slice(0, -1).split('|').map((s) => this._model.localizedRoutes[l][s] || s).join('|') + ')' : this._model.localizedRoutes[l][p] || p)).join('/').replace(/^(.+?)\/*?$/, '$1'));
        }
    }

    /* Public Methods
     ******************** */
    routeManager.initialize = function () {
        const applicationRoutes = document.getElementById('application-routes');
        if(applicationRoutes) {
            this._model.localizedRoutes = JSON.parse(applicationRoutes.innerText);
        }
    }

    routeManager.routeBuilder = function (path, locale) {
        return locale ? (js_environment.NODE_ENV !== 'production' ? (this._model.localizedRoutes[locale].locale || '') + this._buildRoute(locale, path) : this._buildRoute(locale, path)) : this._buildRoutes(path);
    }

    return RouteManager;
})();

export default new RouteManager;
