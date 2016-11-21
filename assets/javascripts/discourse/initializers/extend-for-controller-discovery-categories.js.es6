import computed from 'ember-addons/ember-computed-decorators';
import DiscoveryController from 'discourse/controllers/discovery/categories';
import showModal from 'discourse/lib/show-modal';
import { withPluginApi } from 'discourse/lib/plugin-api';

function initializeControllerDiscoveryCategories(api) {
  DiscoveryController.reopen({
    showCreateButton: true,

    showEditButton: true,

    @computed
    canCreate() {
      return Discourse.User.currentProp('staff');
    },

    @computed("model.parentCategory")
    categoryPageStyle(parentCategory) {
      const style = this.siteSettings.desktop_category_page_style;
      let componentName = style;

      if (parentCategory && style === "categories_and_latest_topics") {
        componentName = "categories_only";
        this.set('showCreateButton', false);
        this.set('showEditButton', true);
      } else {
        this.set('showCreateButton', true);
        this.set('showEditButton', false);
      }

      return Ember.String.dasherize(componentName);
    },

    actions: {
      editCategory: function(category) {
        Category.reloadById(category.get('id')).then((atts) => {
          const model = this.store.createRecord('category', atts.category);
          model.setupGroupsAndPermissions();
          this.site.updateCategory(model);
          showModal('editCategory', { model });
          this.controllerFor('editCategory').set('selectedTab', 'general');
        });
      },

      createCategory: function(){
        const groups = this.site.groups,
              everyoneName = groups.findBy("id", 0).name;

        const model = this.store.createRecord('category', {
          color: "AB9364", text_color: "FFFFFF", group_permissions: [{group_name: everyoneName, permission_type: 1}],
          available_groups: groups.map(g => g.name),
          allow_badges: true
        });

        showModal("editCategory", { model });
        this.controllerFor("editCategory").set("selectedTab", "general");
      }
    }
  });
}

export default {
  name: "extend-for-controller-discovery-categories",

  initialize() {
    withPluginApi('0.1', initializeControllerDiscoveryCategories);
  }
};
