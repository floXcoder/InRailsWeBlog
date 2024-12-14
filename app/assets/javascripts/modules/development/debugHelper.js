let withTrace = false;

const elementChangeHandler = {
    get: function (target, property) {
        if (withTrace) {
            console.error('getting ' + property + ' for ', target);
        } else {
            console.info('getting ' + property + ' for ', target);
        }

        // Property is index in this case
        return target[property];
    },
    set: function (target, property, value /*, receiver */) {
        if (withTrace) {
            console.error('setting ' + property + ' for ', target, ' with value ', value);
        } else {
            console.info('setting ' + property + ' for ', target, ' with value ', value);
        }

        target[property] = value;

        // Return true to accept the changes
        return true;
    }
};

const monitorArray = function (arrayOrObject, enableTrace = false) {
    withTrace = enableTrace;

    return new Proxy(arrayOrObject, elementChangeHandler);
};

// Usage:
// array = monitor(array)
window.monitor = monitorArray;

export default monitorArray;