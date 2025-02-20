import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import "@eslint/compat"
import "eslint-plugin-prettier"
import "eslint-config-prettier"
import _import from "eslint-plugin-import";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...fixupConfigRules(compat.extends(
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:import/typescript",
)), {
    plugins: {
        import: fixupPluginRules(_import),
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            Atomics: "readonly",
            SharedArrayBuffer: "readonly",
        },

        parser: tsParser,
        ecmaVersion: 8,
        sourceType: "module",

        parserOptions: {
            requireConfigFile: false,
            project: "./tsconfig.json",
        },
    },

    settings: {
        "import/resolver": {
            typescript: {
                project: "./tsconfig.json",
            },
        },
    },

    rules: {
        "prettier/prettier": ["error", {
            endOfLine: "auto",
        }],

        "require-jsdoc": "off",
        "linebreak-style": "off",
        "valid-jsdoc": "off",

        "import/no-unresolved": ["error", {
            caseSensitive: true,
        }],

        "import/no-self-import": "error",
        "import/no-cycle": "error",

        "@typescript-eslint/no-unused-vars": ["warn", {
            args: "after-used",
        }],

        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/consistent-type-imports": "error",
        "default-param-last": "error",
        "@typescript-eslint/no-require-imports": "off",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-empty-function": "off",

        "new-cap": ["off", {
            capIsNewExceptions: ["Router", "STRING"],
        }],

        "@typescript-eslint/ban-ts-comment": "warn",
    },
}, {
    files: ["**/*.test.ts", "**/*.spec.ts"],

    rules: {
        "@typescript-eslint/no-explicit-any": "warn",
    },
}];
