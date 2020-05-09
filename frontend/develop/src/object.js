/*!
 * WebCard WcObject class
 */

function WcObject() {
    // incremented everytime WcObject ctor is called.
    WcObject.monotonicId ++;
    this.properties = {
        name: "",
        // treat -1 as undefined
        number: -1,
        // Don't change id ?
        id: WcObject.monotonicId,
    };
}
WcObject.prototype = {
    constructor: WcObject,
    //! todo: rewrite <WcObject>.name = xxx all over the place to use this...
    // helper func
    accessProperty: function(prop, val) {
        // check
        if (!(prop in this.properties)) {
            console.error("property: " + prop + " is not in object");
        }
        // accept val set to prop if "false" or 0
//        if (val || val === false || val === 0) { 
        // accept val set to prop if "false" or 0 or null
        if (val || val === false || val === 0 || val === null) { 
//        console.log(val);
//        console.log(typeof val);
//        if (typeof val !== 'undefined') { // fixme: not working...
            this.properties[prop] = val;
        }
        return this.properties[prop];
    },
    name: function(val) {  return this.accessProperty("name", val); },
    number: function(val) { return this.accessProperty("number", parseInt(val)); },
    // should make read only? i.e. just return this.properties["id"];
    id: function(val) { return this.accessProperty("id", parseInt(val)); }
};

WcObject.monotonicId = 0;

export default WcObject;
