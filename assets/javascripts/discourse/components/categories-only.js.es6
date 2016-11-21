import computed from "ember-addons/ember-computed-decorators";

export default Ember.Component.extend({
  actions: {
    createCategory: function() {
      this.sendAction("createCategory");
    },
    editCategory: function(category) {
      this.sendAction("editCategory", category);
    }
  }
});
