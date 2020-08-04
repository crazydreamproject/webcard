/*!
 * WebCard storage
 */

import _ from 'lodash';
import WcRemote from './remote.js';
import WcUser from './user.js';

// helper functions
// from MDN
function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '___storage_test___';
        storage.setItem(x,x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
            e.code === 22 || // everything except firefox
            e.code === 1014 || // firefox
            e.name === 'QuotaExceededError' ||
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            storage.length !== 0;
    }
}

// singleton to manipulate local/remote/session storage
var storageInstance;
function WcStorage() {
    if (typeof storageInstance === "object") {
        return storageInstance;
    }
    storageInstance = this;
}
WcStorage.prototype = {
    constructor: WcStorage,
    setup: function() {
        // check availability
        //if (!(('localStorage' in window) && (window.localStorage !== null))) {
        if (!storageAvailable('localStorage')) {
            alert("Please use modern browser supporting HTML5 and enable/clear Web Storage!");
            return false;
        }
        // this.local.clear();
        /* NG: removing will show empty content in editor.html open
        this.local.remove(this.keys.edit);
        this.local.remove(this.keys.editObject);
        this.local.remove(this.keys.msg);
        */
        // the origin of event handler. callbacks are called in registered order
        //$(window).on('storage', function(ev) {
        $(window).bind('storage', function(ev) {
            var storage = new WcStorage();
            _.each(storage.local.callbacks, function(c){ c(ev.originalEvent); });
        });
        return true;
    },
    local: {
        callbacks: [],
        save: function(key, value) {
            try {
//                localStorage.setItem(key, JSON.stringify(value));
                //! do stringify on caller side!
                localStorage.setItem(key, value);
            } catch (err) {
                console.error(err);
                if ((err.name === 'QuotaExceededError' || err.name === 'NS_ERROR_DOM_QUOTA_REACHED') && window['localStorage'].length !== 0) {
                    alert("Browser local storage is full. Please clear it from browser menu.");
                } else {
                    alert("Error occured while saving to local storage.");
                }
            }
        },
        load: function(key) {
            var val = localStorage.getItem(key);
            return val;
            /*
            var json = JSON.parse(val);
            // remove added double quotes by JSON.stringify(string)
            // humm.. need unescape \t tab, etc ... 
            if (typeof json === 'string') {
                json = json.slice(1, -1);
            }
            return json.datavalue;
            */
        },
        remove: function(key) {
            localStorage.removeItem(key);
        },
        clear: function() {
            localStorage.clear();
        },
        // returns list of keys in local storage
        list: function() {
            var keys = [];
            for (var i = 0; i < localStorage.length; i++) {
                keys.push(localStorage.key(i));
            }
            return keys;
        },
        register: function(callback) {
            //! todo below, or should better call $(window).on('storage', callback) since it supports multiple entry?
            var len = this.callbacks.length;
            this.callbacks.push(callback);
            return len;
        },
        unregister: function(idx) {
            this.callbacks.splice(idx, 1);
        }
    },
    session: {
        save: undefined,
        load: undefined,
        remove: undefined,
        clear: undefined,
        list: undefined,
        delete: undefined,
        event: undefined
    },
    remote: {
        getUser: function() {
            var json = WcUser.getData();
            if (!json) {
                return null;
            }
            var id = json.id;
            if (typeof id !== 'number') {
                return null;
            }
            return json;
        },
        getUserOrAlert: function() {
            var user = this.getUser();
            if (!user) {
                var err = "You must sign in first";
                console.log(err);
                alert(err);
            }
            return user;
        },
        save: function(name, saveData) {
            // first check if entry with this stack title name exists
            var user = this.getUserOrAlert();
            if (!user) {
                return null;
            }
            var ApiRootUrl = WcRemote.getApiRootUrl();
            var ApiGetUrl = ApiRootUrl + "stacks/?author=" + user.id + "&status=develop"; // + "&title=" + name;
            $.get(ApiGetUrl, function(data, status) {
                if (status === "success") {
                    // limit POST to page size (8)
                    var found = _.find(data.results, ["title", name]);
                    if (!found && data.count >= 8) {
                        var err = "Only up to 8 files can be saved to server. Delete one first!";
                        alert(err);
                        console.error(err);
                        return;
                    }
                    // prepare to post/patch
                    $.ajaxSetup({
                        beforeSend: function(xhr, settings) {
                            if (/^(POST|PUT|PATCH)$/.test(settings.type)) { // && !this.crossDomain) {
                                xhr.setRequestHeader("X-CSRFToken", WcRemote.getCsrfToken());
                            }
                        }
                    });
                    if (found) {
                        console.log(found);
                        // OK, overwrite data. prevent from having multiple same stack title name
                        $.ajax({
                            type: 'PATCH',
                            url: ApiRootUrl + "stacks/" + found.id + '/',
                            dataType: 'json',
                            // timeout:  60 * 1000, // 1min, in millisec
                            data: {
                                data: saveData,
                                //csrfmiddlewaretoken: WcRemote.getCsrfToken()
                            }
                        }).done(function(resp) {
                            var txt = "Updated server data for file: " + name;
                            alert(txt);
                            console.log(txt);
                        }).fail(function(req, status, error) {
                            var err = "Failed to update server data for file: " + name + ". status: " + status + ", error: " + error;
                            err += ", response: " + req.responseText;
                            alert(err);
                            console.error(err);
                            console.error(req);
                        });
                    } else {
                        // OK, POST as new data
                        $.ajax({
                            type: 'POST',
                            url: ApiRootUrl + "stacks/",
                            dataType: 'json',
                            // timeout:  60 * 1000, // 1min, in millisec
                            data: {
                                "title": name,
                                "author": user.id,
                                //"status": "develop", // default
                                "data": saveData,
                                //csrfmiddlewaretoken: WcRemote.getCsrfToken()
                            },
                        }).done(function(resp) {
                            var txt = "Posted to server for file: " + name;
                            alert(txt);
                            console.log(txt);
                        }).fail(function(req, status, error) {
                            var err = "Failed to post to server for file: " + name + ". status: " + status + ", error: " + error;
                            err += ", response: " + req.responseText;
                            alert(err);
                            console.error(err);
                            console.error(req);
                        });
                    }
                } else {
                    // 200 OK not returned. possibly 400 or 500
                    var errtxt = "ERROR: Could not save file: " + name + " to server. staus: " + status + ", response: " + data;
                    console.error(errtxt);
                    alert(errtxt);
                }
            });
        },
        load: function(name, callback) {
            if (typeof callback !== 'function') {
                console.error("callback of WcStorage.remote() should be function, not " + typeof callback);
                return null;
            }
            var user = this.getUserOrAlert();
            if (!user) {
                callback(null);
                return null;
            }
            var ApiRootUrl = WcRemote.getApiRootUrl();
            var ApiUrl = ApiRootUrl + "stacks/?author=" + user.id + "&status=develop";
            // if name is empty, load list, else load one instance
            if (name) {
                ApiUrl += "&title=" + name;
            }
            $.get(ApiUrl, function(data, status) {
                // yes we found you from Rest Api
                if (status === "success") {
                    if (name) {
                        // return content data to callback
                        if (data.count > 0) {
                            // we assume there are only 1 entry with same name. (multiple enties with same name ignored)
                            // get again with this stack id url
                            $.ajax({
                                type: 'GET',
                                url: ApiRootUrl + "stacks/" + data.results[0].id + '/',
                            }).done(function(resp) {
                                // response's data is not text, it's already converted to json object already (by somewhere...)
                                callback(resp.data);
                            }).fail(function(req, status, error) {
                                var err = "Failed to get server data for file: " + name + '. status: ' + status + ', error: ' + error;
                                err += ", response: " + req.responseText;
                                alert(err);
                                console.error(err);
                                console.error(req);
                            });

                        } else {
                            callback(null);
                        }
                    } else {
                        // return list of stack title names
                        // we ignore results.count for now. we dont look through paged "next"
                        if ($.isArray(data.results)) {
                            var names = [];
                            for (var i = 0; i < data.results.length; i++) {
                                names.push(data.results[i].title);
                            }
                            callback(names);
                        } else {
                            console.error("Internal remote load with success but results not array.");
                            callback(null); // should not get here
                        }
                    }
                } else {
                    // 200 OK not returned. possibly 400 or 500
                    callback(null);
                }
            });
        },
        play: function(stackId, callback) {
            if (typeof callback !== 'function') {
                console.error("callback of WcStorage.remote() should be function, not " + typeof callback);
                return null;
            }
            var ApiRootUrl = WcRemote.getApiRootUrl();
            var ApiUrl = ApiRootUrl + "stacks/" + stackId + "/?status=publish";
            $.get(ApiUrl, function(data, status) {
                if (status === "success") {
                    callback(data);
                } else {
                    callback(null);
                }
            })

        },
        remove: function(name) {
            // first check if entry with this stack title name exists
            var user = this.getUserOrAlert();
            if (!user) {
                return null;
            }
            var ApiRootUrl = WcRemote.getApiRootUrl();
            var ApiGetUrl = ApiRootUrl + "stacks/?author=" + user.id + "&status=develop" + "&title=" + name;
            // !TODO : to rewrite with get() .done .fail
            $.get(ApiGetUrl, function(data, status) {
                if (status === "success") {
                    // prepare to delete
                    $.ajaxSetup({
                        beforeSend: function(xhr, settings) {
                            if (/^DELETE$/.test(settings.type)) { // && !this.crossDomain) {
                                xhr.setRequestHeader("X-CSRFToken", WcRemote.getCsrfToken());
                            }
                        }
                    });
                    if (data.count > 0) {
                        // OK DELETE this entry
                        $.ajax({
                            type: 'DELETE',
                            url: ApiRootUrl + "stacks/" + data.results[0].id + '/',
                            dataType: 'json',
                            // timeout : 60 * 1000,
                            data: {
                                //csrfmiddlewaretoken: WcRemote.getCsrfToken()
                            }
                        }).done(function(resp) {
                            var txt = "Delete server data for file: " + name;
                            alert(txt);
                            console.log(txt);
                        }).fail(function(req, status, error) {
                            var err = "Failed to delete server data for file: " + name + ". status: " + status + ", error: " + error;
                            err += ", response: " + req.responseText;
                            alert(err);
                            console.error(err);
                            console.error(req);
                        });
                    } else {
                        // Humm, file to be deleted not found. do nothing.
                        return;
                    }
                } else {
                    // 200 OK not returned. possibly 400 or 500
                    var errtxt = "ERROR: Could not delete file: " + name + " from server. staus: " + status + ", response: " + data;
                    console.error(errtxt);
                    alert(errtxt);
                }
            });
        },
        list: undefined,
    },
    file: {
        save: undefined,
        load: undefined,
    },
    keys: {
        edit: 'editScriptContent',
        editObject: 'editScriptOfObjectName',
        msg: 'messageBoxContent',
        audio: 'audioContent',
        icon: 'iconEditContent',
        iconSelect: 'iconEditContentSelect',
        iconSelectMagic: "_no_icon_in_button_,_do_not_use_this_string_as_icon_name_",
        copyPaste: 'copyPasteClipboard',
        autoSave: 'autoSaveStackContent',
        localStacks: 'namesOfSavedLocalStacks',
        copyCard: 'cutCopyPasteCard',
    }
}

storageInstance = new WcStorage;

export default storageInstance;
