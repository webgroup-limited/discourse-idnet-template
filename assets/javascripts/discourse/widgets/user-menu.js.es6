import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';

createWidget('user-menu-links', {
  tagName: 'div.idnet-menu-links',

  html(attrs) {
    const { currentUser, siteSettings } = this;

    const isAnon = currentUser.is_anonymous;
    const allowAnon = siteSettings.allow_anonymous_posting &&
                      currentUser.trust_level >= siteSettings.anonymous_posting_min_trust_level ||
                      isAnon;

    const path = attrs.path;
    const glyphs = [];

    glyphs.push(this.attach('link', { label: 'user.activity_stream',
                      className: 'user-activity-link',
                      icon: 'idnet-activity',
                      href: `${path}/activity` }));

    glyphs.push(this.attach('user-notifications', { path }));

    if (siteSettings.enable_private_messages) {
      glyphs.push(this.attach('link', { label: 'user.private_messages',
                    className: 'user-pms-link',
                    icon: 'idnet-messages',
                    href: `${path}/messages` }));
    }

    glyphs.push(this.attach('link', { label: 'user.bookmarks',
                      className: 'user-bookmarks-link',
                      icon: 'bookmark',
                      href: `${path}/activity/bookmarks` }));

    glyphs.push(this.attach('link', { label: 'user.summary.title',
                      className: 'user-summary-link',
                      icon: 'idnet-summary',
                      href: `${path}/summary` }));


    if (currentUser.is_anonymous) {
      profileLink.label = 'user.profile';
      profileLink.rawLabel = null;
    }

    const links = [];
    if (allowAnon) {
      if (!isAnon) {
        glyphs.push(this.attach('link', { action: 'toggleAnonymous',
                      label: 'switch_to_anon',
                      className: 'enable-anonymous',
                      icon: 'user-secret' }));
      } else {
        glyphs.push(this.attach('link', { action: 'toggleAnonymous',
                      label: 'switch_from_anon',
                      className: 'disable-anonymous',
                      icon: 'ban' }));
      }
    }

    // preferences always goes last
    glyphs.push(this.attach('link', { label: 'user.preferences',
                  className: 'user-preferences-link',
                  icon: 'idnet-preferences',
                  href: `${path}/preferences` }));

    return h('ul', [
             glyphs.map(l => h('li', l))
            ]);
  }
});

export default createWidget('user-menu', {
  tagName: 'div.idnet-user-menu',

  panelContents() {
    const path = this.currentUser.get('path');

    return [this.attach('user-menu-links', { path }),
            h('hr'),
            this.attach('user-admin-menu'),
            h('div.logout-link', [
              h('ul',
                h('li', this.attach('link', { action: 'logout',
                                                       className: 'logout',
                                                       icon: 'idnet-logout',
                                                       label: 'user.log_out' })))
              ])];
  },

  html() {
    return this.attach('menu-panel', { contents: () => this.panelContents(), maxWidth: 200 });
  },

  clickOutside() {
    this.sendWidgetAction('toggleUserMenu');
  }
});
