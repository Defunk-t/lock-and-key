import {appendFunction} from '../lib/events.js';

import viewStack from './components/view.js';
import unlockForm from './components/unlock-form.js';
import accounts from './components/account-list.js';

document.body.append(unlockForm);

appendFunction('unlock', () =>
	viewStack.push(accounts)
);
