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
        let csrf = $("[name=csrfmiddlewaretoken]").val();
        $.ajaxSetup({
            beforeSend: (xhr, settings) => {
                if (/^(POST|PUT|PATCH|DELETE)$/.test(settings.type)) {
                    xhr.setRequestHeader("X-CSRFToken", csrf);
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
            const stacksUrl = this.apiUrl + "stacks/?author=" + this.userData.id + "&limit=16";
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
            const packagesUrl = this.apiUrl + "packages/?author=" + this.userData.id;
            $.get(packagesUrl, (data, status) => {
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
    postPackage(stk, formData) {
        // do 2 things: post package and update stack status from develop to staging
        let pkgName = formData.get('name');
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
            // stk.status is set by caller from develop to staging. just put it.
            this.putStackStatus(stk);
        }).fail((req, status, err) => {
            alert("FAIL: POST of package: " + pkgName + ", " + err + ": " + req.responseText);
        }).always((data)=>{
            //
        });
    }
    putPackage(stk, pkg, formData) {
        let pkgName = formData.get('name');
        let pkgUrl = this.apiUrl + "packages/" +  pkg.id + '/';
        $.ajax({
            type: "PATCH", // actually PATCH instead of PUT since formdata might lack some fields.
            url: pkgUrl,
            dataType: 'text',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
        }).done((data) => {
            // stk.status is set by caller from develop to staging. just put it.
            this.putStackStatus(stk);
        }).fail((req, status, err) => {
            alert("FAIL: PUT of package: " + pkgName + ", " + err + ": " + req.responseText);
        }).always((data)=>{
            //
        });
    }
    deletePackage(stk, pkg) {
        let pkgName = pkg.name;
        let pkgUrl = this.apiUrl + "packages/" +  pkg.id + '/';
        $.ajax({
            type: "DELETE", // actually PATCH instead of PUT since formdata might lack some fields.
            url: pkgUrl,
        }).done((data) => {
            // stk.status is set by caller from develop to staging. just put it.
            this.putStackStatus(stk);
        }).fail((req, status, err) => {
            alert("FAIL: DELETE of package: " + pkgName + ", " + err + ": " + req.responseText);
        }).always((data)=>{
            //
        });
    }
    putStackStatus(stk) {
        let stackUrl = this.apiUrl + "stacks/" + stk.id + '/';
        $.ajax({
            type: "PATCH",
            url: stackUrl,
            dataType: 'json',
            data: {
                status: stk.status
            }
        }).done((data) => {
            alert("Successful transition to " + stk.status + " of stack: " + stk.title);
        }).fail((data, status, err) => {
            alert("FAIL: transition to " + stk.status + ", " + err + ": " + data.responseText);
        }).always((data) => {
            //
        });
    }

    lazyCall(callback) {
        this.lazycall_.push(callback);
    }
}

export default new Remote();
