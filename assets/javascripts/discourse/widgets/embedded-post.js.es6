import PostCooked from 'discourse/widgets/post-cooked';
import DecoratorHelper from 'discourse/widgets/decorator-helper';
import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';
import { iconNode } from 'discourse/helpers/fa-icon-node';
import DiscourseURL from 'discourse/lib/url';

createWidget('post-link-arrow', {
  html(attrs) {
   if (attrs.above) {
     return h('a.post-info.arrow', {
       attributes: { title: I18n.t('topic.jump_reply_up') }
     }, iconNode('arrow-up'));
   } else {
     return h('a.post-info.arrow', {
       attributes: { title: I18n.t('topic.jump_reply_down') }
     }, iconNode('arrow-down'));
   }
  },

  click() {
    DiscourseURL.routeTo(this.attrs.shareUrl);
  }
});

createWidget('idnet-post-link-arrow', {
  html(attrs) {
   if (attrs.above) {
     return h('a.idnet-jump-to-reply.arrow', {
       attributes: { title: I18n.t('topic.jump_reply_up') }
     }, iconNode('idnet-arrow-up'));
   } else {
     return h('a.idnet-jump-to-back.arrow', {
       attributes: { title: I18n.t('topic.jump_reply_down') }
     }, iconNode('idnet-arrow-down'));
   }
  },

  click() {
    DiscourseURL.routeTo(this.attrs.shareUrl);
  }
});

export default createWidget('idnet-embedded-post', {
  buildKey: attrs => `embedded-post-${attrs.id}`,

  html(attrs, state) {
    return [
      h('div.reply', {attributes: {'data-post-id': attrs.id}}, [
        h('div.row', [
          h('a', iconNode('mail-forward')),
          this.attach('post-avatar', attrs),
          h('div.topic-body', [
            h('div.topic-meta-data', [
              this.attach('poster-name', attrs),
            ]),
            new PostCooked(attrs, new DecoratorHelper(this))
          ]),
          this.attach('idnet-post-link-arrow', { above: state.above, shareUrl: attrs.shareUrl }),
          this.attach('idnet-collapse-reply-above', attrs)
        ])
      ])
    ];
  }
});
