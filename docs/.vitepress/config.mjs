import { defineConfig } from 'vitepress';

import { themeConfig } from './themeConfig.js';
import { viteConfig } from './viteConfig.js';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "PolyU Point Cloud Map",
  description: "PolyU Point Cloud Map",
  base: '/LSGI548',
  themeConfig: themeConfig,
  vite: viteConfig,
})
