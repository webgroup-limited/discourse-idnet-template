import { withPluginApi } from 'discourse/lib/plugin-api';

function initializeModelCategoryList(api) {
  const CategoryList = api.container.lookupFactory('model:category-list');

  CategoryList.reopenClass({
    categoriesFrom(store, result) {
      const categories = CategoryList.create();
      const list = Discourse.Category.list();

      let statPeriod = "all";
      const minCategories = result.category_list.categories.length * 0.66;

      ["week", "month"].some(period => {
        const filteredCategories = result.category_list.categories.filter(c => c[`topics_${period}`] > 0);
        if (filteredCategories.length >= minCategories) {
          statPeriod = period;
          return true;
        }
      });

      result.category_list.categories.forEach(c => {
        if (c.parent_category_id) {
          c.parentCategory = list.findBy('id', c.parent_category_id);
        }

        if (c.subcategory_ids) {
          c.subcategories = c.subcategory_ids.map(scid => list.findBy('id', parseInt(scid, 10)));
        }

        if (c.topics) {
          c.topics = c.topics.map(t => Discourse.Topic.create(t));
        }

        if (c.last_topic) {
          c.last_topic = Discourse.Topic.create(c.last_topic);
        }

        switch(statPeriod) {
          case "week":
          case "month":
            const stat = c[`topics_${statPeriod}`];
            const unit = I18n.t(statPeriod);
            if (stat > 0) {
              c.stat = `<span class="value">${stat}</span> / <span class="unit">${unit}</span>`;
              c.statTitle = I18n.t("categories.topic_stat_sentence", { count: stat, unit: unit });
              c["pick" + statPeriod[0].toUpperCase() + statPeriod.slice(1)] = true;
              break;
            }
          default:
            c.stat = `<span class="value">${c.topics_all_time}</span>`;
            c.statTitle = I18n.t("categories.topic_sentence", { count: c.topics_all_time });
            c.pickAll = true;
            break;
        }

        categories.pushObject(store.createRecord('category', c));
      });
      return categories;
    }
  });
}

export default {
  name: "extend-for-model-category-list",

  initialize() {
    withPluginApi('0.1', initializeModelCategoryList);
  }
};
