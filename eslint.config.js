// @ts-check
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["**/dist/**", "**/build/**", "**/coverage/**", "**/.turbo/**", "**/node_modules/**"],
  },

  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: { ...globals.node },
      parserOptions: {
        projectService: {
          // Config files sit outside each package's tsconfig "include".
          allowDefaultProject: ["*.js", "*.ts", "packages/*/*.ts", "apps/*/*.ts"],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      eqeqeq: ["error", "always"],
    },
  },

  // Packages (and everything that is not apps/api) use verbatimModuleSyntax,
  // so type-only imports must be marked.
  //
  // apps/api is excluded on purpose: NestJS DI reads constructor parameter
  // types at runtime through emitDecoratorMetadata. `import type` erases the
  // class, so Nest cannot resolve the provider. Do not enable this rule (or
  // verbatimModuleSyntax) for apps/api.
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["apps/api/**"],
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
    },
  },

  // Plain JS files are not type-checked.
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    ...tseslint.configs.disableTypeChecked,
  },

  prettier,
);
