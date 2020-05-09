/*!
 * WebCard stack/bg/card layer class
 */

var navbarTopId;

// helper funcs
// check layer is from WcLayer.layers
function checkLayer(layer) {
    switch(layer) {
        case WcLayer.layers.card:
        case WcLayer.layers.background:
        case WcLayer.layers.stack:
            return true;
        default:
            console.error("Unknown layer: " + layer);
            return false;
    }
}

// singleton to hold layer
var layerInstance;

function WcLayer() {
    if (typeof layerInstance === 'object') {
        return layerInstance;
    }
    this.layer = WcLayer.layers.card; // initial state
    layerInstance = this;
}
WcLayer.layers = {
    card: "Card_Layer",
    background: "Background_Layer",
    stack: "Stack_Layer"
};
WcLayer.prototype = {
    constructor: WcLayer,
    setup: function(navbarId) {
        navbarTopId = navbarId;
    },
    getLayer: function() { return this.layer; },
    setLayer: function(layer) {
        if (!checkLayer(layer)) return;
        // remove color schemes
        $(navbarTopId).removeClass('navbar-light bg-light navbar-dark bg-dark bg-primary');
        switch (layer) {
            case WcLayer.layers.card:
                $(navbarTopId).addClass('navbar-light bg-light');
                break;
            case WcLayer.layers.background:
                $(navbarTopId).addClass('navbar-dark bg-dark');
                break;
            case WcLayer.layers.stack:
                $(navbarTopId).addClass('navbar-dark bg-primary');
                break;
        }
        $(document).trigger(layer);
        this.layer = layer;
    },
    register: function(layer, callback) {
        if (!checkLayer(layer)) return;
        //! todo: revisit. $(document) may not be a good element to hook handlers...
        $(document).on(layer, callback);
    },
    unregister: function(layer, callback) {
        if (!checkLayer(layer)) return;
        $(document).off(layer, callback);
    },
    layers: WcLayer.layers,
};

layerInstance = new WcLayer();

export default layerInstance;
