import { createWidget } from 'discourse/widgets/widget';
import { headerHeight } from 'discourse/components/site-header';
import { h } from 'virtual-dom';

export default createWidget('user-notifications', {
  tagName: 'div.notifications',
  buildKey: () => 'user-notifications',

  html(attrs, state) {
    return [this.attach('link', { label: 'user.notifications',
                      className: 'user-notifications-link',
                      icon: 'idnet-notifications',
                      href: `${attrs.path}/notifications`,
                      badgeCount: 'unread_notifications',
                      badgeClass: 'unread-notifications' })];
  }
});
