import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'material-icons/iconfont/material-icons.css';
import 'spectrum-colorpicker/spectrum.css';
import _ from 'lodash';
import './class.js';
import './mode.js';
import layout from './layout.js';
import WcRemote_ from './remote.js';

console.log(_.join(["Hello", "WebCard"], ' '));

layout.setup();

// export so WcRemote can be accessed from django like: WebCard.WcRemote.setup()
export const WcRemote = WcRemote_;

// END