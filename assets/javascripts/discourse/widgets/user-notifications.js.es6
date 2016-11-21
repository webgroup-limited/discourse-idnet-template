import { createWidget } from 'discourse/widgets/widget';
import { headerHeight } from 'discourse/components/site-header';
import { h } from 'virtual-dom';

export default createWidget('user-notifications', {
  tagName: 'div.notifications',
  buildKey: () => 'user-notifications',

  html(attrs, state) {
    return [this.attach('link', { label: 'user.notifications',
                      className: 'user-notifications-link',
                      icon: 'bookmark',
                      href: `${attrs.path}/notifications` })];
  }
});
