/**
 * index.js - Loads the Gotify notifier
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

'use strict';

module.exports = (addonManager, manifest, errorCallback) => {
  if (!manifest.moziot.config.server || !manifest.moziot.config.token) {
    errorCallback(manifest.name, 'Add-on must be configured before use.');
    return;
  }

  try {
    const GotifyNotifier = require('./gotify-notifier');
    new GotifyNotifier(addonManager, manifest);
  } catch (e) {
    if (e instanceof TypeError) {
      errorCallback(manifest.name, 'Gateway does not support notifiers.');
    } else {
      errorCallback(manifest.name, e);
    }
  }
};
