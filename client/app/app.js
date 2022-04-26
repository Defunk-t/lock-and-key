// import {} from '../../node_modules/openpgp/dist/openpgp.min.mjs';
import {appendFunction} from '../lib/events.js';
import UnlockForm from './components/unlock-form.js';
import appInterface from './components/interface.js';

UnlockForm.show();

appendFunction('unlock', () => document.body.append(appInterface));
