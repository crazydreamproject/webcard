/*!
 * WebCard remote class: I/F with remote Django server
 */

// singleton
var remoteInstance;

function WcRemote() {
    if (typeof remoteInstance === 'object') {
        return remoteInstance;
    }
    remoteInstance = this;
    this.userName = '';
    this.ApiUrl = '';
    this.setupCallbackList = [];
}

WcRemote.prototype = {
    constructor: WcRemote,
    setup: function(json) {
        var f;
        this.userName = json.userName;
        this.ApiUrl = json.ApiUrl;
        while((f = this.setupCallbackList.pop()) != null) {
            f(json);
        }
    },
    getUserName: function() {
        return this.userName;

        var userName;// = "AnonymousUser";
        if (typeof window.getUserName === 'function') {
            userName = window.getUserName();
        } else {
            // TODO: OK, we are in standalone development mode. any way to get param/env from webpack config ?
            userName = "user1"
        }
        return userName;
    },
    getApiRootUrl: function() {
        return this.ApiUrl;

        //var ApiUrl = "https://webcard.herokuapp.com/api/v1/";
        //var ApiUrl = "http://localhost:8000/api/v1/";
        var ApiUrl;
        if (typeof parent.getApiRootUrl === 'function') {
            ApiUrl = parent.getApiRootUrl();
        } else {
            // OK, we are in standalone development mode.
            ApiUrl = "http://localhost:8000/api/v1/";
        }
        return ApiUrl;
    },
    getCsrfToken: function() {
        var csrf = $("[name=csrfmiddlewaretoken]").val();
        console.log(csrf);
        return csrf;
        /*
        if (typeof parent.getCsrfToken === 'function') {
            return parent.getCsrfToken();
        } else {
            // No CSRF Token in standalone development mode.
            return "NO CSRF TOKEN (You are in standalone development mode)";
        }
        */
    },
    addSetupCallback: function(callback) {
        this.setupCallbackList.push(callback);
    }
};

remoteInstance = new WcRemote();

export default remoteInstance;
