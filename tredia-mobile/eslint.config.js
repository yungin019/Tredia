// eslint.config.js
const globals = require("globals");
const tseslint = require("typescript-eslint");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const reactNativePlugin = require("eslint-plugin-react-native");

module.exports = [
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "react-native": reactNativePlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...reactNativePlugin.configs.all.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-native/sort-styles": "off",
      "react-native/no-inline-styles": "off",
      "react-native/no-color-literals": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
