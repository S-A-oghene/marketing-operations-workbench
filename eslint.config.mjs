import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    settings: {
      next: {
        rootDir: "apps/web",
      },
    },
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  globalIgnores([
    "**/node_modules/",
    "**/.next/",
    "**/out/",
    "**/dist/",
    "**/coverage/",
    "**/playwright-report/",
    "**/test-results/",
    "**/.mow-repair-backup-*/",
    "**/.mow-navfix-backup-*/",
    "**/.mow-uiux-backup-*/",
    "**/.mow-ux-backup-*/",
  ]),
]);

export default eslintConfig;
