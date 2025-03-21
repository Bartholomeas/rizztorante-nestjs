module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint/eslint-plugin", "import"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "@typescript-eslint/consistent-type-imports": ["warn", { prefer: "type-imports" }],
    "@typescript-eslint/interface-name-prefix": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    // "import/order": [
    //   "warn",
    //   {
    //     groups: [
    //       "builtin",
    //       "external",
    //       "internal",
    //       ["parent", "sibling"],
    //       "index",
    //       "object",
    //       "type",
    //     ],
    //     pathGroups: [
    //       { pattern: "@nestjs/**", group: "external", position: "before" },
    //       { pattern: "@common/**", group: "internal", position: "after" },
    //       { pattern: "@events/**", group: "internal", position: "after" },
    //       { pattern: "@/**", group: "internal", position: "after" },
    //     ],
    //     "newlines-between": "always",
    //     alphabetize: { order: "asc", caseInsensitive: true },
    //     pathGroupsExcludedImportTypes: ["builtin"],
    //   },
    // ],
    "import/no-unresolved": "off",
  },
};
