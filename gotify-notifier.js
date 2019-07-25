const fetch = require('node-fetch');

const {
  Constants,
  Notifier,
  Outlet,
} = require('gateway-addon');

/**
 * An Gotify outlet
 */
class GotifyOutlet extends Outlet {
  /**
   * @param {GotifyNotifier} notifier
   * @param {string} id - A globally unique identifier
   */
  constructor(notifier, id, config) {
    super(notifier, id);
    this.name = 'Gotify';
    this.config = config;
  }

  async notify(title, message, level) {
    let priority = 0;

    switch (level) {
      case Constants.NotificationLevel.LOW:
        priority = 1;
        break;
      case Constants.NotificationLevel.NORMAL:
        priority = 5;
        break;
      case Constants.NotificationLevel.HIGH:
        priority = 9;
        break;
    }

    const body = {
      title,
      message,
      priority,
    };

    // Let errors bubble up to gateway
    await fetch(`${this.config.server}/message?token=${this.config.token}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }).then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to post message: ${res.statusText}`);
      }
    });
  }
}

/**
 * Gotify Notifier
 *
 * Instantiates one Gotify outlet
 */
class GotifyNotifier extends Notifier {
  constructor(addonManager, manifest) {
    super(addonManager, 'gotify', manifest.name);

    addonManager.addNotifier(this);

    if (!this.outlets['gotify-0']) {
      this.handleOutletAdded(
        new GotifyOutlet(this, 'gotify-0', manifest.moziot.config)
      );
    }
  }
}

module.exports = GotifyNotifier;
