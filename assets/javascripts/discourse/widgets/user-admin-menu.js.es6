import { createWidget, applyDecorators } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import DiscourseURL from 'discourse/lib/url';
import { ajax } from 'discourse/lib/ajax';

export default createWidget('user-admin-menu', {
  tagName: 'div.idnet-admin-menu-links',

  adminLinks() {
    const { currentUser } = this;

    const links = [{ route: 'admin',
                     className: 'admin-link',
                     icon: 'idnet-admin',
                     label: 'admin_title' }];

    links.push({ route: 'queued-posts',
                 className: 'queued-posts-link',
                 label: 'queue.title',
                 icon: 'idnet-needs-approval',
                 badgeCount: 'post_queue_new_count',
                 badgeClass: 'queued-posts' });

    links.push({ route: 'adminFlags',
                 className: 'flagged-posts-link',
                 icon: 'flag',
                 label: 'flags_title',
                 badgeClass: 'flagged-posts',
                 badgeTitle: 'notifications.total_flagged',
                 badgeCount: 'site_flagged_posts_count' });


    if (currentUser.admin) {
      links.push({ route: 'adminSiteSettings',
                   icon: 'idnet-settings',
                   label: 'admin.site_settings.title',
                   className: 'settings-link' });
    }

    return h('ul', links.map(l => h('li', this.attach('link', l))));
  },

  lookupCount(type) {
    const tts = this.container.lookup('topic-tracking-state:main');
    return tts ? tts.lookupCount(type) : 0;
  },

  showUserDirectory() {
    if (!this.siteSettings.enable_user_directory) return false;
    if (this.siteSettings.hide_user_profiles_from_public && !this.currentUser) return false;
    return true;
  },

  panelContents() {
    const { currentUser } = this;
    const results = [];

    if (currentUser && currentUser.staff) {
      results.push(this.adminLinks());
      results.push(h('hr'));
    }

    return results;
  },

  html() {
    return this.panelContents();
  }
});
