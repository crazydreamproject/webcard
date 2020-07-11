/*
 * class to communicate with server
 */
'use strict';

class Remote {
    constructor() {
        this.userName = null;
        this.apiUrl = null;
        this.userData = null;
        this.lazycall_ = [];
        this.cachedStacks = null;
        this.cachedPackages = null;
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
                    // console.log("flushing lazy calls");
                    let f;
                    while((f = this.lazycall_.pop()) != null) {
                        f();
                    }
                }
            }
        });
    }
    loggedIn() {
        if (this.userName) {
            return true;
        } else {
            return false;
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
                    this.cachedStacks = data.results;
                    cb(data.results);
                } else {
                    cb(null);
                }
            });
        };
        if (!this.userData) {
            this.lazycall_.push(getnow);
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
                    this.cachedPackages = data.results;
                    cb(data.results);
                } else {
                    cb(null);
                }
            });
        };
        if (!this.userData) {
            this.lazycall_.push(getnow);
        } else {
            getnow();
        }
        return true;
    }
    getCachedStacks() {
        return this.cachedStacks;
    }
    getCachedPackages() {
        return this.cachedPackages;
    }
    postPackage(formData) {
        let csrf = $("[name=csrfmiddlewaretoken]").val();
        let pkgName = formData.get('name');
        $.ajaxSetup({
            beforeSend: (xhr, settings) => {
                if (/^(POST|PUT|PATCH)$/.test(settings.type)) {
                    xhr.setRequestHeader("X-CSRFToken", csrf);
                }
            }
        });
        // do 2 things: post package and update stack status from develop to staging
        let pkgUrl = this.apiUrl + "packages/";
        $.ajax({
            type: "POST",
            url: pkgUrl,
            dataType: 'text',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
        }).done((data) => {
            let stackUrl = this.apiUrl + "stacks/" + formData.get('stack') + '/';
            $.ajax({
                type: "PATCH",
                url: stackUrl,
                dataType: 'json',
                data: {
                    status: "testing" // now this stack has moved to staging (humm todo: change stacks/models.py to staging...)
                }
            }).done((data) => {
                alert("Successful transition to staging of package: " + pkgName);
            }).fail((data) => {
                alert("FAIL: transition to staging of package: " + pkgName);
            }).always((data) => {
                //
            });

        }).fail((req, status, err) => {
            alert("FAIL: POST of package: " + pkgName + ", " + err + ": " + req.responseText);
        }).always((data)=>{
            //
        });
    }
    lazyCall(callback) {
        this.lazycall_.push(callback);
    }
}

export default new Remote();
