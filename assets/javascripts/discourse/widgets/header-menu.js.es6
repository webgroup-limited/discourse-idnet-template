import { createWidget } from 'discourse/widgets/widget';
import { avatarImg } from 'discourse/widgets/post';
import DiscourseURL from 'discourse/lib/url';
import { wantsNewWindow } from 'discourse/lib/intercept-click';
import { h } from 'virtual-dom';

createWidget('header-menu-link', {
  tagName: 'li.ember-view',

  html(attrs) {
    return h('a', { attributes: { href: attrs.href, class: attrs.class } }, attrs.title);
  }
});

createWidget('header-menu-links', {
  tagName: 'ul.menu-links.ember-view.nav.nav-pills.clearfix',

  buildAttributes() {
    return { role: 'navigation' };
  },

  html(attrs) {
    let items = Discourse.SiteSettings.top_menu.split("|");
    let items_length = items.length;
    let i;

    items = items.map(i => Discourse.NavItem.fromText(i, attrs));

    const menuLinks = [];

    for (i = 0; i < items_length; i++) {
      let item = items[i];

      if (!item) { continue; }

      var state = item.get('topicTrackingState');

      if (state) {
        let cnt = state.lookupCount(item.get('name'), item.get('category'));
        let args = { title: item.get('name'), href: '/' + item.get('name') };

        if (cnt > 0 && (args.title == 'unread' || args.title == 'new')) {
          args.title += ' (' + cnt + ')';
        }

        menuLinks.push(this.attach('header-menu-link', args));
      }
    }

    return [menuLinks];
  },
});

export default createWidget('header-menu', {
  tagName: 'div.header-menu',

  html() {
    const panels = [this.attach('header-menu-links')];

    return panels;
  }
});
