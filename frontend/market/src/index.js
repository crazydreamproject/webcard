import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'mdbootstrap/css/mdb.min.css';

import layout from './layout.js';
import remote from './remote.js';
import update from './update.js';

layout.setup();
update.setup();
update.render();

export const WcRemote = remote;
