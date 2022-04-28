import {appendFunction} from '../lib/events.js';

import UnlockForm from './components/unlock-form.js';
import app from './components/interface.js';

UnlockForm.show();

appendFunction('unlock', () => document.body.append(app));
