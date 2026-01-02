/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-order"],
  rules: {
    "selector-class-pattern":
      // Matches BEM-style class names.
      "[a-z](?:-[a-z])*(?:__[a-z](?:-[a-z])*)?(?:--[a-z](?:-[a-z])*)?",
    "order/order": [
      {
        type: "at-rule",
        name: "extend",
      },
      {
        type: "at-rule",
        name: "include",
      },
      "dollar-variables",
      "declarations",
      "rules",
    ],
    "order/properties-alphabetical-order": true,
  },
  overrides: [
    {
      files: ["*.scss", "**/*.scss"],
      extends: ["stylelint-config-standard-scss"],
      rules: {
        "selector-class-pattern":
          "[a-z](?:-[a-z])*(?:__[a-z](?:-[a-z])*)?(?:--[a-z](?:-[a-z])*)?",
      },
    },
    {
      files: ["*.vue", "**/*.vue"],
      extends: ["stylelint-config-standard-vue/scss"],
      rules: {
        "selector-class-pattern":
          "[a-z](?:-[a-z])*(?:__[a-z](?:-[a-z])*)?(?:--[a-z](?:-[a-z])*)?",
        // Allow only class-based selectors in Vue files.
        "selector-disallowed-list": [/^[^.].*$/],
      },
    },
  ],
};
