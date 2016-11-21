import { default as CategoriesAndLatestTopics } from 'discourse/components/categories-and-latest-topics';
import { withPluginApi } from 'discourse/lib/plugin-api';

function initializeComponentCategoriesAndLatestTopics(api) {
  CategoriesAndLatestTopics.reopen({
    actions: {
      createCategory: function(){
        this.sendAction("createCategory");
      }
    }
  });
}

export default {
  name: "extend-for-component-categories-and-latest-topics",

  initialize() {
    withPluginApi('0.1', initializeComponentCategoriesAndLatestTopics);
  }
};
