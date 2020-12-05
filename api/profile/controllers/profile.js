"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  detail: async ctx => {
    return strapi
      .query("profile")
      .findOne(ctx.query, [
        "image",
        "projects",
        "projects.categories",
        "projects.image",
        "project_categories",
        "developer_roles",
        "personal_info",
        "services",
        "soft_skills",
        "hard_skills",
        "educations",
        "experiences",
        "social_media",
        "contact_info",
        "fun_facts"
      ]);
  }
};
