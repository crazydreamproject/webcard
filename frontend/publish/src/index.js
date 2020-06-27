import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'font-awesome/css/font-awesome.min.css';
//import 'material-icons/iconfont/material-icons.css';

import layout from './layout.js';
import remote from './remote.js';
import update from './update.js';

layout.setup();
remote.lazyCall(update.render);

export const WcRemote = remote;
