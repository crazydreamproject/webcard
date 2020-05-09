/*!
 * WebCard mode class
 */

// helper funcs
// check mode is from WcMode.modes
function checkMode(mode) {
    switch(mode) {
        case WcMode.modes.browse:
        case WcMode.modes.edit:
        case WcMode.modes.paint:
            return true;
        default:
            console.error("Unknown mode: " + mode);
            return false;
    }
}

// singleton to hold mode
var modeInstance;

function WcMode() {
    if (typeof modeInstance === 'object') {
        return modeInstance;
    }
    this.mode = WcMode.modes.edit; // initial state
    modeInstance = this;
}
WcMode.modes = {
    browse: "Browse_Mode",
    edit: "Edit_Mode",
    paint: "Paint_Mode"
};
WcMode.prototype = {
    constructor: WcMode,
    getMode: function() { return this.mode; },
    setMode: function(mode) {
        if (!checkMode(mode)) return;
        this.mode = mode;
        $(document).trigger(mode);
    },
    register: function(mode, callback) {
        if (!checkMode(mode)) return;
        //! todo: revisit. $(document) may not be a good element to hook handlers...
        $(document).on(mode, callback);
    },
    unregister: function(mode, callback) {
        if (!checkMode(mode)) return;
        $(document).off(mode, callback);
    },
    modes: WcMode.modes,
};

modeInstance = new WcMode();

export default modeInstance;
