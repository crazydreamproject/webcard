/*!
 * WebCard crypto class
 */

// using bcrypt emits errors when used with webpack. 
//import bcrypt from 'bcrypt';
//const saltRounds = 10;

import crypto from 'crypto';
const cryptoKey = 'magic';

// singleton
var cryptoInstance;

function WcCrypto() {
    if (typeof cryptoInstance === 'object') {
        return cryptoInstance;
    }
    cryptoInstance = this;
}
WcCrypto.prototype = {
    constructor: WcCrypto,
    // crypto version
    encrypt: function(text) {
        var cipher = crypto.createCipher('aes256', cryptoKey);
        cipher.update(text, 'utf8', 'hex');
        var ret = cipher.final('hex');
        return ret;
    },
    decrypt: function(text) {
        var decipher = crypto.createDecipher('aes256', cryptoKey);
        decipher.update(text, 'hex', 'utf8');
        var ret = decipher.final('utf8');
        return ret;
    },
    /** bcrypt version
    encrypt: function(text) {
//        var hash = text;
        var hash = bcrypt.hashSync(text, saltRounds);
        return hash;
    },
    compare: function(text, hash) {
//        var res = false;
        var res = bcrypt.compareSync(text, hash);
        return res;
    },
    // no way to decrypt hash. use compare above th check
    //decrypt: function(text) {
    */
};

cryptoInstance = new WcCrypto();

export default cryptoInstance;
