import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";


export default [
  { 
    files: ['**/*.js'],
    languageOptions: { globals: globals.node }
  },
  
  pluginJs.configs.recommended,
  eslintConfigPrettier,
];