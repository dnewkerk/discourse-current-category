// References:
// app/assets/javascripts/discourse/initializers/page-tracking.js.es6
// discourse-adplugin/assets/javascripts/discourse/components/ad-component.js.es6
export default {
  name: "current-category",

  initialize(container, app) {
    let categoryId;
    const router = container.lookup("router:main");
    router.on("routeDidChange", this, () => {
      // Listings
      if (router.currentRoute.attributes && router.currentRoute.attributes.category) {
        categoryId = router.currentRoute.attributes.category.id;
      // Topics
      } else if (router.currentRoute.parent && router.currentRoute.parent.attributes) {
        categoryId = router.currentRoute.parent.attributes.category_id;
      } else {
        categoryId = null;
      }

      // For the initial version, always return the parent category.
      if (categoryId) {
        const category = Discourse.Category.findById(categoryId);
        categoryId = category.parent_category_id ? category.parent_category_id : category.id;
      }

      Discourse.currentCategory = categoryId;
      const appEvents = container.lookup("service:app-events");
      appEvents.trigger("category:changed", categoryId);
    });
  }
};
