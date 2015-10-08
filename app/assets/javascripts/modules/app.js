var App = function() {
    //this.views = {
    //    users: {}
    //};
};

App.prototype.start = function() {
    // send CSRF tokens for all ajax requests
    $.ajaxSetup({
        cache: false,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'));
        }
    });
};

module.exports = new App();
