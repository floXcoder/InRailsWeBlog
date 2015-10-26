(function (root, factory) {
    if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define([], function () {
            return (root.returnExportsGlobal = factory());
        });
    } else {
        // Global Variables
        root.returnExportsGlobal = factory();
    }
}(this, function () {
    'use strict';

    var ModuleHelper = (function () {

        var moduleHelper = {
            updateSelectorParams: function (params, model, paramObjects) {
                for (var paramIndex = 0; paramIndex < paramObjects.length; paramIndex++) {
                    var param = paramObjects[paramIndex];

                    if (!model.hasOwnProperty(param) || $app.utils.isEmpty(param)) {
                        $app.log.info('Params undefined : ' + param);
                        continue;
                    }

                    if (typeof(params) !== 'undefined' && typeof(params[param]) !== 'undefined' && typeof(model[param]) !== 'undefined') {
                        model[param] = params[param];
                    } else {
                        model[param].update();
                    }
                }
            },
            updateNormalParams: function (params, model, paramObjects) {
                for (var paramIndex = 0; paramIndex < paramObjects.length; paramIndex++) {
                    var param = paramObjects[paramIndex];

                    if (!model.hasOwnProperty(param) || $app.utils.isEmpty(param)) {
                        $app.log.info('Params undefined : ' + param);
                        continue;
                    }

                    if (typeof(params) !== 'undefined' && typeof(params[param]) !== 'undefined' && typeof(model[param]) !== 'undefined') {
                        model[param] = params[param];
                    }
                }
            }
        };

        return moduleHelper;
    })();

    return ModuleHelper;
}));
