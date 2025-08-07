import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

// Add settings to the React plugin configuration
pluginReactConfig.settings = {
  react: {
    version: "detect"
  }
};

export default [
  {
    files: ["babel.config.js", "screens/SplashScreen.js"],
    languageOptions: {
      globals: {
        module: "readonly",
        require: "readonly"
      }
    }
  },
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  pluginReactConfig,
];
