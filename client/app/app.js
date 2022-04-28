import {appendFunction} from '../lib/events.js';

import unlockForm from './components/unlock-form.js';
import app from './components/interface.js';

document.body.append(unlockForm);

appendFunction('unlock', () => document.body.append(app));
