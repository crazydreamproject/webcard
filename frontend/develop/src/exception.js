/*!
 * WebCard WcException class
 */

import _ from 'lodash';

function WcException(args) {
    // default to exit type
    this.type = (_.has(args, 'type')) ? args.type : WcException.type.exit;
    this.msg = (_.has(args, 'msg')) ? args.msg : "";
    this.callback = (_.has(args, 'callback')) ? args.callback : undefined;
}

WcException.type = {
    pass: "Pass event msg to bubble up",
    exit: "Exit to HyperCard",
    emergency: "Stop script execution"
};

export default WcException;
