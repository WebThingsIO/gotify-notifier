/**
 * index.js - Loads the Gotify notifier
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

const {Database} = require('gateway-addon');
const manifest = require('./manifest.json');

module.exports = (addonManager, _, errorCallback) => {
  const db = new Database(manifest.id);
  db.open().then(() => {
    return db.loadConfig();
  }).then((config) => {
    if (!config.server || !config.token) {
      errorCallback(manifest.id, 'Add-on must be configured before use.');
      return;
    }

    try {
      const GotifyNotifier = require('./gotify-notifier');
      new GotifyNotifier(addonManager, config);
    } catch (e) {
      if (e instanceof TypeError) {
        errorCallback(manifest.id, 'Gateway does not support notifiers.');
      } else {
        errorCallback(manifest.id, e);
      }
    }
  }).catch((e) => {
    errorCallback(manifest.id, e);
  });
};
