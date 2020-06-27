/*
 * class to communicate with server
 */
'use strict';

class Remote {
    constructor() {
        this.userName = null;
        this.apiUrl = null;
        this.userData = null;
        this.lazycall = [];
    }
    setup(json) {
        this.userName = json.userName;
        this.apiUrl = json.ApiUrl;
        const authorUrl = this.apiUrl + "authors/?username=" + this.userName;
        $.get(authorUrl, (data, status) => {
            // yes we found you from Rest Api
            if (status === "success" && data.count == 1) {
                if ($.isArray(data.results)) {
                    this.userData = data.results[0];
                    /* now pop all lazycalls pushed during setup to now. */
                    let f;
                    while((f = this.lazycall.pop()) != null) {
                        f();
                    }
                }
            }
        });
    }
    loggedIn() {
        if (!this.userName) {
            return false;
        } else {
            return true;
        }
    }
    getMyData() {
        return this.userData;
    }
    getMyStacks(callback) {
        if (!this.loggedIn()) {
            return false;
        }
        let getnow = () => {
            let cb = callback; // responsibility of caller to pass valid function
            const stacksUrl = this.apiUrl + "stacks/?author=" + this.userData.id;
            $.get(stacksUrl, (data, status) => {
                if (status === "success") {
                    cb(data.results);
                } else {
                    cb(null);
                }
            });
        };
        if (!this.userData) {
            this.lazycall.push(getnow);
        } else {
            getnow();
        }
        return true;
    }
    getMyPackages(callback) {
        if (!this.loggedIn()) {
            return false;
        }
        let getnow = () => {
            let cb = callback; // responsibility of caller to pass valid function
            const stacksUrl = this.apiUrl + "packages/?author=" + this.userData.id;
            $.get(stacksUrl, (data, status) => {
                if (status === "success") {
                    cb(data.results);
                } else {
                    cb(null);
                }
            });
        };
        if (!this.userData) {
            this.lazycall.push(getnow);
        } else {
            getnow();
        }
        return true;
    }
}

export default new Remote();
