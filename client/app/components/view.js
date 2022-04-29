import {createElement, ViewStack} from "../../lib/ui/index.js";

export default ViewStack(createElement('main', {}, e => document.body.appendChild(e)));
