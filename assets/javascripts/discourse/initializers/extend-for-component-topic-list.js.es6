import { default as TopicList } from 'discourse/components/topic-list';
import { withPluginApi } from 'discourse/lib/plugin-api';

function initializeComponentTopicList(api) {
  TopicList.reopen({
    classNames: ['topic-list', 'idnet', 'table'],
  });
};

export default {
  name: "extend-for-component-topic-list",

  initialize() {
    withPluginApi('0.1', initializeComponentTopicList);
  }
};
