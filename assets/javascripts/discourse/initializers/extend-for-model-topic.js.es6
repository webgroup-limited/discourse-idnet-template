import Topic from 'discourse/models/topic';
import RestModel from 'discourse/models/rest';
import computed from 'ember-addons/ember-computed-decorators';
import { withPluginApi } from 'discourse/lib/plugin-api';

function initializeModelTopic(api) {
  Topic.reopen({
    @computed('last_poster')
    lastPoster(last_poster) {
      let user = Discourse.User.create(last_poster);
      return user || this.get("creator");
    },

    creatorUrl: function() {
      return Discourse.getURL("/users/") + this.get("creator.username");
    }.property('creator')
  });
}

export default {
  name: "extend-for-model-topic",

  initialize() {
    withPluginApi('0.1', initializeModelTopic);
  }
};
