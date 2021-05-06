'use strict';

// Production classnames are overlapping each other
const pseudoClasses = ['checked', 'disabled', 'error', 'focused', 'focusVisible', 'required', 'expanded', 'selected'];

const generateClassName = function (options = {}) {
    const disableGlobal = options.disableGlobal || false;
    // var productionPrefix = options.productionPrefix || 'jss';
    const seed = options.seed || '';
    const seedPrefix = seed === '' ? '' : ''.concat(seed, '-');
    let ruleCounter = 0;

    const getNextCounterId = function getNextCounterId() {
        ruleCounter += 1;

        return ruleCounter;
    };

    return function (rule, styleSheet) {
        const name = styleSheet.options.name; // Is a global static MUI style?

        if (name && name.indexOf('Mui') === 0 && !styleSheet.options.link && !disableGlobal) {
            // We can use a shorthand class name, we never use the keys to style the components.
            if (pseudoClasses.indexOf(rule.key) !== -1) {
                return "Mui-".concat(rule.key);
            }

            const prefix = "".concat(seedPrefix).concat(name, "-").concat(rule.key);

            if (!styleSheet.options.theme[Symbol.for('mui.nested')] || seed !== '') {
                return prefix;
            }

            return "".concat(prefix, "-").concat(getNextCounterId());
        }

        // if (process.env.NODE_ENV === 'production') {
        //     return "".concat(seedPrefix).concat(productionPrefix).concat(getNextCounterId());
        // }

        const suffix = "".concat(rule.key, "-").concat(getNextCounterId()); // Help with debuggability.

        if (styleSheet.options.classNamePrefix) {
            return "".concat(seedPrefix).concat(styleSheet.options.classNamePrefix, "-").concat(suffix);
        }

        return "".concat(seedPrefix).concat(suffix);
    };
};

export default generateClassName();
