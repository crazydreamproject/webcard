/*!
 * WebCard user class
 */

import WcRemote from './remote.js';

// singleton
var userInstance;

function WcUser() {
    if (typeof userInstance === 'object') {
        return userInstance;
    }
    this.status_ = WcUser.status.logout;
    this.dataJson = null;
    userInstance = this;
    WcRemote.addSetupCallback(this.setupCallback);
}
WcUser.status = {
    login: "Logged In",
    logout: "Logged Out",
};
WcUser.prototype = {
    constructor: WcUser,
    setupCallback: function(json) {
        var userName = WcRemote.getUserName();
        var ApiUrl = WcRemote.getApiRootUrl();
        ApiUrl += "authors/?username=" + userName;
        // TODO: to run HTTP GET via fetch()
        //console.log(typeof fetch);
        $.get(ApiUrl, function(data, status) {
            // yes we found you from Rest Api
            if (status === "success" && data.count == 1) {
                if ($.isArray(data.results)) {
                    userInstance.login(data.results[0]);
                    //console.log("Now user: " + userName + " is confirmed to logged in");
                }
            }
        });
    },
    login: function(json) {
        this.dataJson = json;
        this.status_ = WcUser.status.login;
    },
    logout: function() {
        this.status_ = WcUser.status.logout;
    },
    getData: function() {
        return this.dataJson;
    },
    getStatus: function() {
        return this.status_;
    },
    status: WcUser.status

};

userInstance = new WcUser();

export default userInstance;
