export default {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-native/all",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["react", "react-native", "@typescript-eslint"],
  env: {
    "react-native/react-native": true,
    es6: true,
    node: true,
  },
  rules: {
    // Customize your rules here
    "react-native/no-inline-styles": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
