'use strict';

class App {
    constructor() {
        this.user = {
            currentId: $.isEmpty(window.currentUserId) ? null : parseInt(window.currentUserId, 10),
            current: {},
            settings: {},
            currentTopic: {},
            topics: []
        };

        this.admin = {
            currentId: $.isEmpty(window.currentAdminId) ? null : parseInt(window.currentAdminId, 10),
            current: null,
            settings: null
        };
    }

    isUserConnected() {
        return !!this.user.currentId;
    }

    isUserLoaded() {
        return !!this.user.current;
    }

    getCurrentTopic() {
        if (this.isUserLoaded()) {
            return this.user.currentTopic;
        } else {
            return false;
        }
    }

    isOwner () {
        return this.user.currentId === 1;
    }

    isValidUser(userId) {
        if (userId) {
            return (userId === this.user.currentId);
        } else {
            return false;
        }
    }

    isAdminConnected() {
        return !!this.admin.currentId;
    }
}

const $app = new App();

export default $app;
