/*
 * class to communicate with server
 */
'use strict';

class Remote {
    constructor() {
        this.apiUrl = null;
        this.lazycall = [];
    }
    setup(json) {
        this.apiUrl = json.ApiUrl;
        let f;
        while((f = this.lazycall.pop()) != null) {
            f();
        }
    }
    // todo handle pagination
    getPublishedPackages(callback) {
        let getnow = () => {
            let cb = callback; // responsibility of caller to pass valid function
            const packagesUrl = this.apiUrl + "packages/?available=true";
            $.get(packagesUrl, (data, status) => {
                if (status === "success") {
                    cb(data);
                } else {
                    cb(null);
                }
            });
        };
        if (!this.apiUrl) {
            this.lazycall.push(getnow);
        } else {
            getnow();
        }
        return true;
    }
}

export default new Remote();
